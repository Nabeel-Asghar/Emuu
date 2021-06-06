const { admin, db } = require("../util/admin");
const functions = require("firebase-functions");

const config =
  functions.config().app.environment === "dev"
    ? require("../util/config")
    : require("../util/config.prod");
const storageBucketVar = config.storageBucket;
const sharp = require("sharp");
const path = require("path");
const defaultProfilePicture = "defaultProfilePicture.png";
const BusBoy = require("busboy");
const os = require("os");
const fs = require("fs");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  saveObjectToAlgolia,
  partialUpdateObjectToAlgolia,
} = require("./algolia");

const {
  validateSignUpData,
  validateLoginData,
  validatePhotographerPageData,
  validateResetPasswordData,
  validateProfileUpdate,
} = require("../util/validators");
const { deleteFromStorage } = require("./vault");

// Sign up normal users
exports.signup = (req, res) => {
  const newUser = {
    ...req.body,
    createdAt: new Date().toISOString(),
    profileImage: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultProfilePicture}?alt=media`,
  };
  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return res.status(400).json(errors).end();

  let token, userId;

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      delete newUser.password;
      delete newUser.confirmPassword;
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((tokenID) => {
      token = tokenID;
      return db.doc(`/users/${userId}`).set(newUser);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ general: err.message }).end();
    });
};

// Sign up Photographers
exports.signupPhotographer = (req, res) => {
  const defaultProfilePicture = "defaultProfilePicture.png";

  const newPhotographer = req.body;
  newPhotographer.createdAt = new Date().toISOString();
  newPhotographer.profileImage = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultProfilePicture}?alt=media`;

  const userCredentials = {
    email: newPhotographer.email,
    firstName: newPhotographer.firstName,
    lastName: newPhotographer.lastName,
    photographer: newPhotographer.photographer,
    createdAt: newPhotographer.createdAt,
    profileImage: newPhotographer.profileImage,
    registration: false,
  };

  const { valid, errors } = validateSignUpData(newPhotographer);

  if (!valid) return res.status(400).json(errors).end();

  let token, userId;

  firebase
    .auth()
    .createUserWithEmailAndPassword(
      newPhotographer.email,
      newPhotographer.password
    )
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((tokenID) => {
      token = tokenID;
      db.doc(`/users/${userId}`).set(userCredentials);
    })
    .then(() => {
      delete newPhotographer.confirmPassword;
      delete newPhotographer.password;
      db.doc(`/photographer/${userId}`).set(newPhotographer);
      newPhotographer.objectID = userId;
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ general: err.message });
    });
};

// Login for both users and photographers
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
      var user = firebase.auth().currentUser;

      if (!firebase.auth().currentUser.emailVerified) {
        user
          .sendEmailVerification()
          .then(function () {
            return res.status(400).json({
              general: "You must verify your email to log in",
            });
          })
          .catch(function (error) {
            // An error happened.
          });
      } else {
        return res.json({ token });
      }

      if (res.locals.registration == "incomplete") {
        return res.status(400).json({
          registration: "You must complete your photographer profile!",
        });
      }
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

// Change your account password
exports.changePassword = (req, res) => {
  var email = req.body.email;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;

  const { valid, errors } = validateChangePassword(req.body);
  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, oldPassword)
    .then(() => {
      var user = firebase.auth().currentUser;
      user.updatePassword(newPassword);
    })
    .then(() => {
      return res.json({ message: "Password changed!" });
    })

    .catch(function (err) {
      if ((err.code = "auth/weak-password")) {
        return res
          .status(400)
          .json({ matching: "Password is not strong enough." });
      } else if ((err.code = "auth/requires-recent-login")) {
        return res
          .status(400)
          .json({ general: "Must have recently logged in." });
      } else if ((err.code = "auth/weak-password")) {
        return res.status(400).json({ login: "Wrong password." });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

// Send reset password email
exports.resetPassword = (req, res) => {
  var emailAddress = req.body.email;

  const { valid, errors } = validateResetPasswordData(emailAddress);
  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .sendPasswordResetEmail(emailAddress)
    .then(() => {
      return res.json({ message: "Password reset email sent!" });
    })
    .catch((err) => {
      if ((err.code = "auth/user-not-found")) {
        return res.status(400).json({
          general: "There is no user corresponding to the email address",
        });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

// Set details for your photography page
exports.setYourPhotographyPage = async (req, res) => {
  const reqDetails = req.body;

  const { valid, errors } = validatePhotographerPageData(reqDetails);
  if (!valid) return res.status(400).json(errors);

  let photographer = await getPhotographer(req.user.uid);

  let algoliaObject = { ...reqDetails, ...photographer };
  algoliaObject.registration = true;
  algoliaObject.objectID = req.user.uid;

  db.doc(`/photographer/${req.user.uid}`)
    .update(reqDetails)
    .then(() => {
      db.doc(`/users/${req.user.uid}`).update({ registration: true });
    })
    .then(() => {
      saveObjectToAlgolia(algoliaObject);
    })
    .then(() => {
      return res
        .status(200)
        .json({ message: "Your photographer page has been updated." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Update your photographer page
exports.updatePhotographerCategoriesAndBio = (req, res) => {
  const photographerPageDetails = req.body;

  db.doc(`/photographer/${req.user.uid}`)
    .update(photographerPageDetails)
    .then(() => {
      photographerPageDetails.objectID = req.user.uid;
      partialUpdateObjectToAlgolia(photographerPageDetails);
    })
    .then(() => {
      return res.json({ message: "Your information has been updated." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Upload profile image for user
exports.uploadProfilePicture = async (req, res) => {
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let thumbnailName;

  let imageToBeUploaded = {};
  let profileImageToBeUploaded = {};
  let thumbnailToBeUploaded = {};

  let tempPath = null;
  let imagePath = null;
  let thumbnailPath = null;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (!mimetype.includes("image")) {
      return res.status(400).json({ error: "Please upload an image." });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    const source = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    thumbnailName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    tempPath = path.join(os.tmpdir(), source);
    imagePath = path.join(os.tmpdir(), imageFileName);
    thumbnailPath = path.join(os.tmpdir(), thumbnailName);

    imageToBeUploaded = { tempPath, mimetype };
    profileImageToBeUploaded = { imagePath: imagePath, mimetype };
    thumbnailToBeUploaded = { imagePath: thumbnailPath, mimetype };

    file.pipe(fs.createWriteStream(tempPath));
  });

  busboy.on("finish", async () => {
    try {
      await uploadProfileImage(
        imageToBeUploaded,
        profileImageToBeUploaded,
        imageFileName,
        req.user.uid,
        500,
        false,
        res.locals.photographer,
        req.user.email
      );
      await uploadProfileImage(
        imageToBeUploaded,
        thumbnailToBeUploaded,
        thumbnailName,
        req.user.uid,
        100,
        true,
        res.locals.photographer,
        req.user.email
      );
    } catch (err) {
      console.log("error uploading profile/thumbnail.", err);
      return res.status(400).json({ message: "Something went wrong." });
    }
  });

  busboy.end(req.rawBody);

  return res.json({ message: "Profile image updated" });
};

// Upload your background picture for your page
exports.uploadBackgroundPicture = (req, res) => {
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
    try {
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
          const background = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
          return db.doc(`/photographer/${req.user.uid}`).update({ background });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "Something went wrong." });
        });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Something went wrong." });
    }
  });
  busboy.end(req.rawBody);
  return res.json({ message: "Background image updated" });
};

// Update users profile details
exports.updateUserProfile = (req, res) => {
  let photographer = res.locals.photographer;

  const userDetails = req.body;

  const { valid, errors } = validateProfileUpdate(userDetails);
  if (!valid) return res.status(400).json(errors);

  db.doc(`/users/${req.user.uid}`)
    .update(userDetails)
    .then(() => {
      if (photographer) {
        db.doc(`/photographer/${req.user.uid}`)
          .update(userDetails)
          .then(() => {
            let alogliaUserDetails = userDetails;
            alogliaUserDetails.objectID = req.user.uid;
            partialUpdateObjectToAlgolia(alogliaUserDetails);
          });
      } else {
        return res.json({ message: "Your user profile has been updated." });
      }
    })
    .then(() => {
      return res.json({ message: "Your user profile has been updated." });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

// Getting the current user photography page
exports.getYourPhotographerPage = (req, res) => {
  let photographer = res.locals.photographer;

  if (!photographer) {
    return res.json({ message: "You are not a photographer." });
  }

  db.doc(`photographer/${req.user.uid}`)
    .get()
    .then((doc) => {
      let page = [];
      page.push(doc.data());

      return res.status(200).json(page);
    })
    .catch((err) => {
      return res.status(403).json({ error: err });
    });
};

// Getting the current user profile page
exports.getYourUserProfile = (req, res) => {
  let userid = req.user.uid;

  db.doc(`users/${userid}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.json({ message: "You are not a user." });
      }

      let page = [];

      page.push({
        userID: userid,
        ...doc.data(),
      });

      return res.status(200).json(page);
    })
    .catch((err) => console.error(err));
};

/*TODO: Edit doc data function later*/
exports.getYourPhotographerOrders = (req, res) => {
  let photographerID = req.user.uid;

  db.collection(`photographer/${photographerID}/orders`)
    .orderBy("formattedDate", "desc")
    .get()
    .then((snapshot) => {
      let orders = [];

      snapshot.forEach((doc) => {
        orders.push({ orderID: doc.data().id, ...doc.data() });
      });
      return res.status(200).json(orders);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

/*TODO: Edit doc data function later*/
exports.getYourPhotographerReviews = (req, res) => {
  let photographerID = req.user.uid;

  db.collection(`photographer/${photographerID}/reviews`)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let reviews = [];

      data.forEach((doc) => {
        reviews.push(doc.data());
      });

      return res.json(reviews);
    })
    .catch((err) => {
      return res.json({ error: err });
    });
};

/*TODO: Edit doc data function later*/
exports.getYourPhotographerPastOrders = (req, res) => {
  let photographerID = req.user.uid;

  db.collection(`photographer/${photographerID}/completedOrders`)
    .orderBy("formattedDate", "desc")
    .get()
    .then((snapshot) => {
      let allPastOrders = [];

      snapshot.forEach((doc) => {
        allPastOrders.push({ orderID: doc.data().id, ...doc.data() });
      });
      return res.json(allPastOrders);
    })
    .catch((err) => {
      return res.json({ error: err });
    });
};

// get users current orders
exports.getUsersOrders = (req, res) => {
  let userid = req.user.uid;

  db.collection(`users/${userid}/orders`)
    .get()
    .then((data) => {
      let orders = [];

      data.forEach((doc) => {
        orders.push({ orderID: doc.data().id, ...doc.data() });
      });
      return res.json(orders);
    })
    .catch((err) => console.error(err));
};

// get user past orders
exports.getUsersPastOrders = (req, res) => {
  let userid = req.user.uid;

  db.collection(`users/${userid}/completedOrders`)
    .orderBy("formattedDate", "desc")
    .get()
    .then((snapshot) => {
      let allPastOrders = [];

      snapshot.forEach((doc) => {
        allPastOrders.push({ orderID: doc.data().id, ...doc.data() });
      });

      return res.json(allPastOrders);
    })
    .catch((err) => console.error(err));
};

// Gets all reviews done by user
exports.getUserReviews = (req, res) => {
  let userid = req.user.uid;

  db.collection(`users/${userid}/reviews`)
    .orderBy("createdAt", "desc")
    .get()
    .then((snapshot) => {
      let reviews = [];

      snapshot.forEach((doc) => {
        reviews.push(doc.data());
      });

      return res.status(200).json(reviews);
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

exports.editBookingTimes = (req, res) => {
  let date = req.body.date;
  let timeslots = req.body.time;
  let algoliaDates = req.body.algoliaDates;
  let userid = req.user.uid;

  db.collection(`photographer/${userid}/bookings`)
    .doc(date)
    .set(timeslots)
    .then(() => {
      partialUpdateObjectToAlgolia({
        dates: { _operation: "AddUnique", value: algoliaDates },
        objectID: userid,
      });
    })
    .then(() => {
      return res.status(200).json({ message: "success" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
};

// photographers can upload pictures for their page
exports.uploadYourPhotographyImages = (req, res) => {
  let photographer = res.locals.photographer;
  let userID = req.user.uid;

  if (!photographer) {
    return res.status(403).json({ message: "You are not a photographer." });
  }

  const imageNames = req.body;
  let imageUrls = [];

  imageNames.forEach((image) => {
    // Replace the "/" with "%2F" in the url since google storage does that for some dumbass reason if placing in folder
    url = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/users%2F${userID}%2F${image}?alt=media`;
    imageUrls.push(url);
  });

  db.doc(`/photographer/${userID}`)
    .update({
      images: admin.firestore.FieldValue.arrayUnion(...imageUrls),
    })
    .then(() => {
      return res.json({ message: "Photos uploaded" });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

exports.deleteImages = async (req, res) => {
  let userid = req.user.uid;
  let theImagesToDelete = req.body;

  const docs = db.collection("photographer").doc(userid);

  const promises = theImagesToDelete.forEach(async (image) => {
    let imageLocation = getImageLocation(image, userid);
    await deleteFromDatabase(image, userid);
    deleteFromStorage(imageLocation);
  });

  await Promise.all([Promise.resolve(promises)]);
  return res.json({ response: "Image(s) deleted" });
};

function getImageLocation(image, userID) {
  let urlSplit = image.split("%2F");
  let partWeWant = urlSplit[2];
  let imageName = partWeWant.split("?");
  let imageLocation = `users/${userID}/${imageName[0]}`;
  return imageLocation;
}

function deleteFromDatabase(image, userID) {
  return db
    .collection("photographer")
    .doc(`${userID}`)
    .update({ images: admin.firestore.FieldValue.arrayRemove(image) })
    .then((res) => {
      console.log("deleted from database");
      return true;
    })
    .catch((err) => {
      return res.json({ error: err });
    });
}

exports.editBookingTimes = (req, res) => {
  let date = req.body.date;
  let timeslots = req.body.time;
  let algoliaDates = req.body.algoliaDates;
  let userid = req.user.uid;

  db.collection("photographer")
    .doc(userid)
    .collection("bookings")
    .doc(date)
    .set(timeslots)
    .then(() => {
      partialUpdateObjectToAlgolia({
        dates: { _operation: "AddUnique", value: algoliaDates },
        objectID: userid,
      });
    })
    .then(() => {
      return res.json({ message: "success" });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: err });
    });
};

async function uploadProfileImage(
  originalImage,
  image,
  fileName,
  userID,
  size,
  thumbnail,
  photographer,
  email
) {
  sharp(originalImage.tempPath)
    .resize(size, size)
    .toFile(image.imagePath)
    .then(async () => {
      await uploadToStorage(image, userID, fileName);
      await updateProfileImage("users", userID, fileName, thumbnail, email);
      photographer &&
        (await updateProfileImage(
          "photographer",
          userID,
          fileName,
          thumbnail,
          email
        ));
      if (thumbnail) {
        fs.unlinkSync(originalImage.tempPath);
      }
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

function uploadToStorage(file, folder, filename) {
  return admin
    .storage()
    .bucket(config.storageBucket)
    .upload(file.imagePath, {
      resumable: false,
      destination: `users/${folder}/${filename}`,
      metadata: {
        metadata: {
          contentType: file.mimetype,
        },
      },
    })
    .then(() => {
      console.log();
      return true;
    })
    .catch(() => {
      return false;
    });
}

function updateProfileImage(database, id, imageFileName, thumbnail, email) {
  if (thumbnail) {
    const thumbnailImage = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/users%2F${id}%2F${imageFileName}?alt=media`;
    updateChatProfileImages(thumbnailImage, email);
    return db.collection(database).doc(id).update({ thumbnailImage });
  } else {
    const profileImage = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/users%2F${id}%2F${imageFileName}?alt=media`;
    partialUpdateObjectToAlgolia({
      profileImage: profileImage,
      objectID: id,
    });
    console.log("profile image: ", profileImage);
    return db.collection(database).doc(id).update({ profileImage });
  }
}

function updateChatProfileImages(thumbnailImage, email) {
  const properEmail = new admin.firestore.FieldPath(email);

  console.log(properEmail);

  return db
    .collection("chats")
    .where("users", "array-contains", email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        doc.ref.update(properEmail, {
          profileImage: thumbnailImage || "",
        });
      });
    });
}

function getPhotographer(userid) {
  return db
    .doc(`photographer/${userid}`)
    .get()
    .then((doc) => {
      return doc.data();
    })
    .catch((err) => {
      console.log("error", err);
      return null;
    });
}
