const { admin, db, index } = require("../util/admin");
const config = require("../util/config");
const storageBucketVar = config.storageBucket;

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignUpData,
  validateLoginData,
  validatePhotographerPageData,
  validateBio,
  validateResetPasswordData,
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

  console.log("newuser: ", newUser);

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return res.status(400).json(errors);

  const defaultProfilePicture = "defaultProfilePicture.png";

  let token, userId;

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data.user.uid;

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
      var user = firebase.auth().currentUser;

      // if (!firebase.auth().currentUser.emailVerified) {
      //   user
      //     .sendEmailVerification()
      //     .then(function () {
      //       return res.status(400).json({
      //         general: "You must verify your email to log in",
      //       });
      //     })
      //     .catch(function (error) {
      //       // An error happened.
      //     });
      // } else {
      return res.json({ token });
      // }
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

exports.addFirestoreDataToAlgolia = (req, res) => {
  db.collection("photographer")
    .get()
    .then((docs) => {
      let photographers = [];
      docs.forEach((doc) => {
        let user = doc.data();
        user.objectID = doc.id;
        photographers.push(user);
      });

      index
        .saveObjects(photographers)
        .then(() => {
          return res.status(400).json({
            message: "Contacts imported",
          });
        })
        .catch((error) => {
          console.error("Error when importing contact into Algolia", error);
        });
    });
};

exports.reauthenticateUser = () => {
  var user = firebase.auth().currentUser;
  var credential = firebase.auth.EmailAuthProvider.credential(
    "adeelasghgar1001@gmail.com",
    "bigman123"
  );

  return user.reauthenticateWithCredential(credential);
};

exports.changePassword = (req, res) => {
  var email = req.body.email;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  var newPasswordConfirm = req.body.newPasswordConfirm;

  if (newPassword === oldPassword) {
    return res.status(400).json({
      similar: "Your new password can't be the same as the old one.",
    });
  }

  if (newPassword !== newPasswordConfirm) {
    return res.status(400).json({
      matching: "Passwords don't match.",
    });
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email, oldPassword)
    .then(() => {
      var user = firebase.auth().currentUser;

      user
        .updatePassword(newPassword)
        .then(function () {
          return res.json({ message: "Password changed!" });
        })
        .catch(function (err) {
          if ((err.code = "auth/weak-password")) {
            return res.status(400).json({
              matching: "Password is not strong enough.",
            });
          } else if ((err.code = "auth/requires-recent-login")) {
            return res.status(400).json({
              general: "Must have recently logged in.",
            });
          } else {
            return res.status(500).json({ error: err.code });
          }
        });
    })
    .catch(function (err) {
      if ((err.code = "auth/weak-password")) {
        return res.status(400).json({
          login: "Wrong password.",
        });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

exports.resetPassword = (req, res) => {
  var emailAddress = req.body.email;

  const { valid, errors } = validateResetPasswordData(emailAddress);

  if (!valid) return res.status(400).json(errors);

  //
  firebase
    .auth()
    .sendPasswordResetEmail(emailAddress)
    .then(() => {
      return res.json({
        message: "Password reset email sent!",
      });
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
    totalRating: 0,
    reviewCount: 0,
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

// update your photographer page
exports.updatePhotographerPage = (req, res) => {
  const photographerPageDetails = req.body;

  console.log(photographerPageDetails);

  // const { valid, errors } = validateBio(photographerPageDetails);

  // if (!valid) return res.status(400).json(errors);

  db.doc(`/photographer/${req.user.uid}`)
    .update(photographerPageDetails)
    .then(() => {
      return res.json({ message: "Your bio has been updated." });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.setPhotographerCategories = (req, res) => {
  const categories = req.body.categories;

  db.doc(`/photographer/${req.user.uid}`)
    .update({
      ["categories"]: categories,
    })
    .then(() => {
      return res.json({ message: "Your categories has been updated." });
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
        const profileImage = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.uid}`).update({ profileImage });
      })
      .then(() => {
        const profileImage = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/photographer/${req.user.uid}`).update({ profileImage });
      })
      .then(() => {
        return res.json({ message: "Profile Image update" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

// upload your background picture for your page
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
      .then(() => {
        return res.json({ message: "Background Image update" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

// update users profile details
exports.updateUserProfile = (req, res) => {
  let photographer = res.locals.photographer;

  const userDetails = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    location_city: req.body.location_city,
    location_state: req.body.location_state,
  };

  db.doc(`/users/${req.user.uid}`)
    .update(userDetails)
    .then(() => {
      if (photographer) {
        db.doc(`/photographer/${req.user.uid}`)
          .update(userDetails)
          .then(() => {
            return res.json({ message: "Your user profile has been updated." });
          })
          .catch((err) => {
            return res.status(500).json({ error: err.code });
          });
      } else {
        return res.json({ message: "Your user profile has been updated." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
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
        camera: doc.data().camera,
        headline: doc.data().headline,
        categories: doc.data().categories,
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
        location_city: doc.data().location_city,
        location_state: doc.data().location_state,
      });

      return res.json(page);
    })
    .catch((err) => console.error(err));
};

exports.getYourPhotographerOrders = (req, res) => {
  let photograhperID = req.user.uid;

  db.collection("photographer")
    .doc(photograhperID)
    .collection("orders")
    .orderBy("formattedDate", "desc")
    .get()
    .then((snapshot) => {
      let orders = [];

      snapshot.forEach((doc) => {
        orders.push({
          consumerID: doc.data().consumerID,
          photographerID: doc.data().photographerID,
          firstName: doc.data().consumerFirstName,
          lastName: doc.data().consumerLastName,
          profileImage: doc.data().consumerProfileImage,
          shootDate: doc.data().shootDate,
          shootTime: doc.data().shootTime,
          formattedDate: doc.data().formattedDate,
        });
      });
      return res.json(orders);
    })
    .catch((err) => {
      return res.json({ error: err });
    });
};

exports.getYourPhotographerReviews = (req, res) => {
  let photographerID = req.user.uid;

  db.collection("photographer")
    .doc(photographerID)
    .collection("reviews")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let reviews = [];

      data.forEach((doc) => {
        reviews.push({
          title: doc.data().title,
          description: doc.data().description,
          rating: doc.data().rating,
          userID: doc.data().userID,
          photographerID: doc.data().photographerBeingReviewed,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          createdAt: doc.data().createdAt,
        });
      });

      return res.json(reviews);
    })
    .catch((err) => {
      return res.json({ error: err });
    });
};

exports.getYourPhotographerPastOrders = (req, res) => {
  let photograhperID = req.user.uid;

  db.collection("photographer")
    .doc(photograhperID)
    .collection("completedOrders")
    .orderBy("formattedDate", "desc")
    .get()
    .then((snapshot) => {
      let allPastOrders = [];

      snapshot.forEach((doc) => {
        allPastOrders.push({
          consumerID: doc.data().consumerID,
          photographerID: doc.data().photographerID,
          firstName: doc.data().consumerFirstName,
          lastName: doc.data().consumerLastName,
          profileImage: doc.data().consumerProfileImage,
          shootDate: doc.data().shootDate,
          shootTime: doc.data().shootTime,
          formattedDate: doc.data().formattedDate,
        });
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

  db.collection("users")
    .doc(userid)
    .collection("orders")
    .get()
    .then((data) => {
      let orders = [];

      data.forEach((doc) => {
        orders.push({
          consumerID: doc.data().consumerID,
          photographerID: doc.data().photographerID,
          firstName: doc.data().photographerFirstName,
          lastName: doc.data().photographerLastName,
          profileImage: doc.data().photographerProfileImage,
          shootDate: doc.data().shootDate,
          shootTime: doc.data().shootTime,
          formattedDate: doc.data().formattedDate,
        });
      });
      return res.json(orders);
    })
    .catch((err) => console.error(err));
};

// get user past orders
exports.getUsersPastOrders = (req, res) => {
  let userid = req.user.uid;

  db.collection("users")
    .doc(userid)
    .collection("completedOrders")
    .orderBy("formattedDate", "desc")
    .get()
    .then((snapshot) => {
      let allPastOrders = [];

      snapshot.forEach((doc) => {
        allPastOrders.push({
          consumerID: doc.data().consumerID,
          photographerID: doc.data().photographerID,
          firstName: doc.data().photographerFirstName,
          lastName: doc.data().photographerLastName,
          profileImage: doc.data().photographerProfileImage,
          shootDate: doc.data().shootDate,
          shootTime: doc.data().shootTime,
          formattedDate: doc.data().formattedDate,
        });
      });

      return res.json(allPastOrders);
    })
    .catch((err) => console.error(err));
};

exports.getUserReviews = (req, res) => {
  let userid = req.user.uid;

  db.collection("users")
    .doc(userid)
    .collection("reviews")
    .orderBy("createdAt", "desc")
    .get()
    .then((snapshot) => {
      let reviews = [];

      snapshot.forEach((doc) => {
        reviews.push({
          title: doc.data().title,
          description: doc.data().description,
          rating: doc.data().rating,
          userID: doc.data().userID,
          photographerID: doc.data().photographerBeingReviewed,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          createdAt: doc.data().createdAt,
          photographerLastName: doc.data().photographerLastName,
          photographerFirstName: doc.data().photographerFirstName,
          photographerProfile: doc.data().photographerProfile,
          photographerID: doc.data().photographerID,
        });
      });

      console.log(reviews);

      return res.json(reviews);
    })
    .catch((err) => {
      return res.json({ error: err });
    });
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

    console.log("ImageURLS:", imageUrls);

    imageUrls.forEach((image) => {
      db.doc(`/photographer/${req.user.uid}`)
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

exports.deleteImages = (req, res) => {
  let userid = req.user.uid;
  let theImagesToDelete = req.body;
  console.log("Here: ", theImagesToDelete);

  const docs = db.collection("photographer").doc(userid);

  theImagesToDelete.forEach((image) => {
    docs
      .update({ images: admin.firestore.FieldValue.arrayRemove(image) })
      .catch((err) => {
        res.json({ error: err });
      });
  });

  return res.json({ message: "Pictures deleted" });
};

exports.editBookingTimes = (req, res) => {
  let date = req.body.date;
  let timeslots = req.body.time;
  let userid = req.user.uid;

  console.log("Date: ", date);
  console.log("Timeslots: ", timeslots);

  db.collection("photographer")
    .doc(userid)
    .collection("bookings")
    .doc(date)
    .set(timeslots)
    .then((doc) => {
      return res.json({ message: "success" });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: err });
    });
};
