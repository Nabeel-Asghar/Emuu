const { admin, db, storage } = require("../util/admin");
const config = require("../util/config");
const storageBucketVar = config.photoVault;
var JSZip = require("jszip");
const imageToBase64 = require("image-to-base64");

exports.getVault = async (req, res) => {
  let vaultID = req.params.vaultID;
  let id = req.user.uid;

  // check access level
  let vault = await checkID(vaultID, id);

  if (vault) {
    console.log(vault);
    return res.json(vault);
  } else {
    return res.status(401).json({ error: "Access denied" });
  }
};

exports.downloadImages = async (req, res) => {
  let vaultID = req.params.vaultID;

  let files = await getFiles(vaultID);
  let images = await getImages(files);
  let zipFile = await zipImages(images);

  res.set("Content-Type", "application/zip");
  res.set("Content-Disposition", "attachment; filename=images.zip");
  res.set("Content-Length", zipFile.length);
  return res.end(zipFile, "binary");
};

exports.uploadToVault = async (req, res) => {
  let vaultID = req.params.vaultID;

  console.log(vaultID);

  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToAdd;
  let imagesToUpload = [];

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (!mimetype.includes("image")) {
      return res.status(400).json({ error: "Please upload an image." });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);
    console.log("filepath", filepath);
    imageToAdd = { imageFileName, filepath, mimetype };

    file.pipe(fs.createWriteStream(filepath));
    imagesToUpload.push(imageToAdd);
  });

  busboy.on("finish", () => {
    let promises = [];
    let imageUrls = [];

    imagesToUpload.forEach((imageToBeUploaded) => {
      // Replace the "/" with "%2F" in the url since google storage does that for some dumbass reason if placing in folder
      url = `https://firebasestorage.googleapis.com/v0/b/${storageBucketVar}/o/vault_${vaultID}%2F${imageToBeUploaded.imageFileName}?alt=media`;
      imageUrls.push(url);
      promises.push(
        storage.bucket(storageBucketVar).upload(imageToBeUploaded.filepath, {
          destination: `vault_${vaultID}/${imageToBeUploaded.imageFileName}`,
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype,
            },
          },
        })
      );
    });

    console.log("ImageURLS:", imageUrls);
    // TODO: store images without a for loop
    imageUrls.forEach((image) => {
      db.doc(`/photoVault/vault_${vaultID}`)
        .update({
          images: admin.firestore.FieldValue.arrayUnion(image),
        })
        .catch((err) => {
          return res.json({ error: err });
        });
    });

    res.writeHead(200, { Connection: "close" });
    res.end("All images uploaded successfully.");
  });

  busboy.end(req.rawBody);
};

function checkID(vaultID, id) {
  return db
    .collection("photoVault")
    .doc(`vault_${vaultID}`)
    .get()
    .then((doc) => {
      if (doc.data().consumerID === id) {
        return { access: "consumer", data: doc.data() };
      } else if (doc.data().photographerID === id) {
        return { access: "photographer", data: doc.data() };
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("error", err);
      return null;
    });
}

function getFiles(vaultID) {
  return storage
    .bucket(storageBucketVar)
    .getFiles({ prefix: `vault_${vaultID}/` })
    .then((files) => {
      return files;
    })
    .catch((err) => {
      console.log("error", err);
      return null;
    });
}

function getImages(files) {
  let images = [];

  files[0].forEach((file) => {
    if (file.name.slice(file.name.length - 4).includes(".")) {
      images.push(file);
    }
  });

  return images;
}

async function zipImages(images) {
  var zip = new JSZip();
  var counter = 0;

  console.log("start");

  const promises = images.map(async (image) => {
    const url = await getUrl(image);
    const imageFile = await getImage(url);
    return zip.file(`${image.name}`, imageFile, { base64: true });
  });

  await Promise.all(promises);

  return zip.generateAsync({ type: "string" });
}

function getUrl(image) {
  return image
    .getSignedUrl({
      version: "v2", // defaults to 'v2' if missing.
      action: "read",
      expires: Date.now() + 1000 * 60 * 60, // one hour
    })
    .then((url) => {
      return url;
    });
}

function getImage(url) {
  return imageToBase64(url).then((imageFile) => {
    return imageFile;
  });
}
