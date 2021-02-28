const { admin, db, storage } = require("../util/admin");
const config = require("../util/config");
const storageBucketVar = config.photoVault;
var JSZip = require("jszip");
const imageToBase64 = require("image-to-base64");
const email = require("./email");
const payment = require("./payment");
const { TIME_TO_PAYOUT } = require("../util/constants");
//const { logToFile } = require("../util/log");

exports.getVault = async (req, res) => {
  let vaultID = req.params.vaultID;
  let id = req.user.uid;

  // check access level
  let vault = await checkID(vaultID, id);

  if (vault) {
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
  const vaultID = req.params.vaultID;
  const imageNames = req.body;
  console.log(req.body);
  let imageUrls = [];

  imageNames.forEach((image) => {
    // Replace the "/" with "%2F" in the url since google storage does that for some dumbass reason if placing in folder
    url = `https://firebasestorage.googleapis.com/v0/b/${storageBucketVar}/o/${vaultID}%2F${image}?alt=media`;
    imageUrls.push(url);
  });

  db.doc(`/photoVault/${vaultID}`)
    .update({
      images: admin.firestore.FieldValue.arrayUnion(...imageUrls),
    })
    .catch((err) => {
      return res.json({ error: err });
    });
};

exports.deleteFromVault = async (req, res) => {
  let vaultID = req.params.vaultID;
  let images = req.body;

  const promises = images.map(async (image) => {
    let imageLocation = getImageLocation(image, vaultID);
    await deleteFromStorage(imageLocation);
    await deleteFromDatabase(image, vaultID);
  });

  await Promise.all(promises);

  return res.json({ response: "Image(s) deleted" });
};

exports.getVaultSize = async (req, res) => {
  let vaultID = req.params.vaultID;

  let files = await getFiles(vaultID);
  let allSizes = [];

  files[0].forEach((file) => {
    allSizes.push(file.metadata.size);
  });

  return res.json({ size: allSizes });
};

exports.notifyCustomer = async (req, res) => {
  try {
    const orderID = req.params.vaultID;
    const { consumerID, photographerID } = await getVaultOwners(orderID);
    let customerDetails = await getPersonDetails(consumerID);
    customerDetails.vaultID = req.params.vaultID;
    await editVaultValues(req.params.vaultID, { notifiedCustomer: true });
    await email.emailVaultReady(customerDetails);
    await schedulePayout(orderID, consumerID, photographerID);
    return res.json({ response: true });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ response: false });
  }
};

exports.finalizeVault = async (req, res) => {
  try {
    const orderID = req.params.vaultID;
    const { consumerID, photographerID } = await getVaultOwners(orderID);
    await payment.payOut(orderID, consumerID, photographerID);
    return res.json({
      response: "You've confirmed your photos. You may now download them!",
    });
  } catch (err) {
    console.log("error finalizing vault: ", err);
    return res.status(400).json({ response: "Error confirming photos." });
  }
};

function getVaultOwners(orderID) {
  return db
    .collection("photoVault")
    .doc(orderID)
    .get()
    .then((doc) => {
      return {
        consumerID: doc.data().consumerID,
        photographerID: doc.data().photographerID,
      };
    })
    .catch((err) => {
      console.log("error getting getting vault owners");
      return null;
    });
}

function checkID(vaultID, id) {
  return db
    .collection("photoVault")
    .doc(`${vaultID}`)
    .get()
    .then((doc) => {
      if (doc.data().consumerID === id) {
        return {
          access: "consumer",
          data: doc.data(),
          notifiedCustomer: doc.data().notifiedCustomer,
          confirmedByCustomer: doc.data().confirmedByCustomer,
        };
      } else if (doc.data().photographerID === id) {
        return {
          access: "photographer",
          data: doc.data(),
          notifiedCustomer: doc.data().notifiedCustomer,
          confirmedByCustomer: doc.data().confirmedByCustomer,
        };
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
    .getFiles({ prefix: `${vaultID}/` })
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
    images.push(file);
  });

  return images;
}

async function zipImages(images) {
  var zip = new JSZip();

  const promises = images.map(async (image) => {
    const url = await getUrl(image);
    const imageFile = await getImage(url);
    //logToFile(image);
    return zip.file(`${image.name}.jpg`, imageFile, { base64: true });
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

function deleteFromStorage(imageLocation) {
  storage
    .bucket(storageBucketVar)
    .deleteFiles({ prefix: imageLocation })
    .then((res) => {
      console.log("deleted from storage");
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteFromDatabase(image, vaultID) {
  const docs = db.collection("photoVault").doc(`${vaultID}`);
  docs
    .update({ images: admin.firestore.FieldValue.arrayRemove(image) })
    .then((res) => {
      console.log("deleted from database");
      return true;
    })
    .catch((err) => {
      res.json({ error: err });
    });
}

function getImageLocation(image, vaultID) {
  let urlSplit = image.split("%2F");
  let partWeWant = urlSplit[1];
  let imageName = partWeWant.split("?");
  let imageLocation = `${vaultID}/${imageName[0]}`;
  return imageLocation;
}

function getPersonID(vaultID, type) {
  return db
    .collection("photoVault")
    .doc(`${vaultID}`)
    .get()
    .then((doc) => {
      if (type === "customer") {
        return doc.data().consumerID;
      } else if (type === "photographer") {
        return doc.data().photographerID;
      }
    });
}

function getPersonDetails(id) {
  return db
    .collection("users")
    .doc(id)
    .get()
    .then((doc) => {
      return doc.data();
    });
}

function editVaultValues(id, object) {
  return db
    .collection("photoVault")
    .doc(`${id}`)
    .update(object)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

function schedulePayout(orderID, consumerID, photographerID) {
  let theDate = new Date();
  theDate.setDate(theDate.getDate() + 2);
  db.collection("scheduler")
    .doc(orderID)
    .set({
      data: {
        consumerID: consumerID,
        photographerID: photographerID,
      },
      performAt: getDateToPayout(),
      status: "scheduled",
    });
}

function getDateToPayout() {
  let theDate = new Date();
  theDate.setDate(theDate.getDate() + TIME_TO_PAYOUT);
  return theDate;
}
