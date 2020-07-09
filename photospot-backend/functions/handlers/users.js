const { admin, db } = require("../util/admin");
const config = require("../util/config");
const storageBucketVar = config.storageBucket;

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignUpData,
  validateLoginData,
  validatePhotographerPageData,
  reduceUserDetails,
} = require("../util/validators");

// signup
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    photographer: req.body.photographer,
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return res.status(400).json(errors);

  const defaultProfilePicture = "defaultProfilePicture.png";

  let token, userId;

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data.user.uid;
      console.log(userId);
      return data.user.getIdToken();
    })
    .then((tokenID) => {
      token = tokenID;
      const userCredentials = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        photographer: newUser.photographer,
        createdAt: new Date().toISOString(),
        profileImage: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultProfilePicture}?alt=media`,
      };
      console.log(userId);

      //  user details in photographer and users table when person is a photographer
      if (userCredentials.photographer === true) {
        db.doc(`/photographer/${userId}`)
          .set(userCredentials)
          .then(() => {
            return db.doc(`/users/${userId}`).set(userCredentials);
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
          });
      } else {
        return db.doc(`/users/${userId}`).set(userCredentials);
      }
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// login
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (
        (err.code = "auth/email-already-in-use") ||
        (err.code = "auth/wrong-password")
      ) {
        return res.status(400).json({
          general: "Your login or password was incorrect. Please try again",
        });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

// set details for your photography page
exports.setYourPhotographyPage = (req, res) => {
  const photographerPageDetails = {
    bio: req.body.bio,
    background: req.body.background,
    images: req.body.images,
    location_city: req.body.location_city,
    location_state: req.body.location_state,
    profileImage: req.body.profileImage,
    company: req.body.company,
    website: req.body.website,
    instagram: req.body.instagram,
    ratePerHour: req.body.ratePerHour,
  };

  const { valid, errors } = validatePhotographerPageData(
    photographerPageDetails
  );

  if (!valid) return res.status(400).json(errors);

  db.doc(`/photographer/${req.user.uid}`)
    .update(photographerPageDetails)
    .then(() => {
      return res.json({ message: "Your photographer page has been updated." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// upload profile image for user
exports.uploadProfilePicture = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (!mimetype.includes("image")) {
      return res.status(400).json({ error: "Please upload an image." });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };

    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket(config.storageBucket)
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        console.log(config.storageBucket);
        const profileImage = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.uid}`).update({ profileImage });
      })
      .then(() => {
        return res.json({
          message: "Image uploaded successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

// getting the current user photography page
exports.getYourPhotographerPage = (req, res) => {
  let userid = req.user.uid;
  let photographer = res.locals.photographer;

  if (!photographer) {
    return res.json({ message: "You are not a photographer." });
  }

  db.collection("photographer")
    .doc(userid)
    .get()
    .then((doc) => {
      let page = [];

      page.push({
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        email: doc.data().email,
        bio: doc.data().bio,
        background: doc.data().background,
        images: doc.data().images,
        location_city: doc.data().location_city,
        location_state: doc.data().location_state,
        profileImage: doc.data().profileImage,
        company: doc.data().company,
        website: doc.data().website,
        instagram: doc.data().instagram,
        ratePerHour: doc.data().location_state,
      });

      return res.json(page);
    })
    .catch((err) => {
      return res.status(403).json({ error: err });
    });
};

exports.getYourUserProfile = (req, res) => {
  let userid = req.user.uid;

  db.collection("users")
    .doc(userid)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.json({ message: "You are not a user." });
      }

      let page = [];

      page.push({
        userID: userid,
        email: doc.data().email,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        photographer: doc.data().photographer,
        profileImage: doc.data().profileImage,
        createdAt: doc.data().createdAt,
      });

      return res.json(page);
    })
    .catch((err) => console.error(err));
};

// photographers can upload pictures for their page
exports.uploadYourPhotographyImages = (req, res) => {
  let photographer = res.locals.photographer;

  if (!photographer) {
    return res.json({ message: "You are not a photographer." });
  }

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
    imageToAdd = { imageFileName, filepath, mimetype };

    file.pipe(fs.createWriteStream(filepath));
    imagesToUpload.push(imageToAdd);
  });

  busboy.on("finish", () => {
    let promises = [];
    let imageUrls = [];

    imagesToUpload.forEach((imageToBeUploaded) => {
      console.log(imageToBeUploaded.imageFileName);
      url = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageToBeUploaded.imageFileName}?alt=media`;
      imageUrls.push(url);
      promises.push(
        admin
          .storage()
          .bucket(config.storageBucket)
          .upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
              metadata: {
                contentType: imageToBeUploaded.mimetype,
              },
            },
          })
      );
    });

    db.doc(`/photographer/${req.user.uid}`).update({ images: imageUrls });
    res.writeHead(200, { Connection: "close" });
    res.end("All images uploaded successfully.");
  });
  busboy.end(req.rawBody);
};
