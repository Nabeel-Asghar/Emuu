const { db, admin } = require("../util/admin");
const { partialUpdateObjectToAlgolia } = require("./algolia");
const { validateReview } = require("../util/validators");

exports.getReviews = (req, res) => {
  let photographerID = req.params.photographerId;

  db.collection("photographer")
    .doc(photographerID)
    .collection("reviews")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let reviews = [];

      data.forEach((doc) => {
        reviews.push(doc.data());
      });

      return res.json(reviews).end();
    })
    .catch((err) => {
      return res.json({ error: err }).end();
    });
};

exports.reviewPhotographer = async (req, res) => {
  const userID = req.user.uid;
  const photographerBeingReviewedID = req.params.photographerId;

  const newReview = {
    ...req.body,
    userID: userID,
    photographerID: photographerBeingReviewedID,
    firstName: res.locals.firstName,
    lastName: res.locals.lastName,
    createdAt: new Date().toISOString(),
  };

  const { valid, errors } = validateReview(newReview);
  console.log("errors: ", errors);
  if (!valid) return res.status(400).json(errors).end();

  let existingReview = await checkReviewExists(
    photographerBeingReviewedID,
    userID
  );
  if (existingReview) {
    return res
      .status(400)
      .json({ error: "You cannot review someone twice." })
      .end();
  }

  // Add review to that photographer document
  db.collection("photographer")
    .doc(photographerBeingReviewedID)
    .collection("reviews")
    .doc(userID)
    .set(newReview)
    .then(() => {
      db.collection("users")
        .doc(userID)
        .collection("reviews")
        .doc(photographerBeingReviewedID)
        .set(newReview);
    })
    .then(() => {
      const pRef = db
        .collection("photographer")
        .doc(photographerBeingReviewedID);

      return db.runTransaction((transaction) => {
        return transaction.get(pRef).then((doc) => {
          if (!doc.exists) {
            throw "Document does not exist!";
          }

          const totalRating = (doc.data().totalRating || 0) + req.body.rating;
          const reviewCount = (doc.data().reviewCount || 0) + 1;
          const averageRating = totalRating / reviewCount;

          // Commit to Firestore
          transaction.update(pRef, {
            totalRating: totalRating,
            reviewCount: reviewCount,
            averageRating: averageRating,
          });

          partialUpdateObjectToAlgolia({
            totalRating: totalRating,
            reviewCount: reviewCount,
            averageRating: averageRating,
            objectID: photographerBeingReviewedID,
          });
        });
      });
    })
    .then(() => {
      return res
        .status(200)
        .json({ message: "Your review has been posted." })
        .end();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong` }).end();
    });
};

exports.editReview = (req, res) => {
  let description = req.body.description || "";
  let rating = req.body.rating || "";
  let title = req.body.title || "";
  let userid = req.user.uid;
  let photographerBeingReviewed = req.body.photographerID;
  let oldRating = req.body.oldRating;

  const updateReview = {
    description: description,
    rating: rating,
    title: title,
  };

  const { valid, errors } = validateReview(newReview);
  if (!valid) return res.status(400).json(errors).end();

  db.collection("photographer")
    .doc(photographerBeingReviewed)
    .collection("reviews")
    .doc(userid)
    .update(updateReview)
    .then(() => {
      db.collection("users")
        .doc(userid)
        .collection("reviews")
        .doc(photographerBeingReviewed)
        .update(updateReview);
    })
    .then(() => {
      const pRef = db.collection("photographer").doc(photographerBeingReviewed);

      return db.runTransaction((transaction) => {
        return transaction.get(pRef).then((document) => {
          if (!document.exists) {
            throw "Document does not exist!";
          }

          var reviewCount = document.data().reviewCount;
          var totalRating = document.data().totalRating - oldRating + rating;
          var averageRating = oldRatingTotal / newNumRatings;

          transaction.update(pRef, {
            reviewCount: reviewCount,
            totalRating: totalRating,
            averageRating: averageRating,
          });

          partialUpdateObjectToAlgolia({
            reviewCount: reviewCount,
            totalRating: totalRating,
            averageRating: averageRating,
            objectID: photographerBeingReviewed,
          });
        });
      });
    })
    .then(() => {
      return res
        .status(200)
        .json({ message: "Your review has been edited." })
        .end();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong` }).end();
    });
};

exports.deleteReview = (req, res) => {
  let userid = req.user.uid;
  let photographerBeingReviewed = req.body.photographerID;
  let oldRating = req.body.oldRating;

  db.collection("photographer")
    .doc(photographerBeingReviewed)
    .collection("reviews")
    .doc(userid)
    .delete()
    .then(() => {
      db.collection("users")
        .doc(userid)
        .collection("reviews")
        .doc(photographerBeingReviewed)
        .delete();
    })
    .then(() => {
      const pRef = db.collection("photographer").doc(photographerBeingReviewed);

      return db.runTransaction((transaction) => {
        return transaction.get(pRef).then((document) => {
          if (!document.exists) {
            throw "Document does not exist!";
          }

          const totalRating = document.data().totalRating - oldRating;
          const reviewCount = document.data().reviewCount - 1;
          const averageRating = totalRating / reviewCount;

          // Commit to Firestore
          transaction.update(pRef, {
            reviewCount: reviewCount,
            totalRating: totalRating,
            averageRating: averageRating,
          });

          partialUpdateObjectToAlgolia({
            reviewCount: reviewCount,
            totalRating: totalRating,
            averageRating: averageRating,
            objectID: photographerBeingReviewed,
          });
        });
      });
    })
    .then(() => {
      return res
        .status(200)
        .json({ message: "Your review has been deleted." })
        .end();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong` });
    });
};

exports.getSpecificPhotographer = (req, res) => {
  let photographerIdOfPageClicked = req.params.photographerId;
  let photographer = [];

  var dbRef = db.collection("photographer").doc(photographerIdOfPageClicked);

  dbRef.update({
    views: admin.firestore.FieldValue.increment(1),
  });

  dbRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.json({ message: "Page not found." }).end();
      }

      photographer.push({
        photographerID: photographerIdOfPageClicked,
        ...doc.data(),
      });
      return res.json(photographer).end();
    })
    .catch((err) => {
      res.status(500).json({ error: `Something went wrong.` }).end();
    });
};

exports.getPricing = (req, res) => {
  let photographerId = req.params.photographerId;
  db.collection("photographer")
    .doc(photographerId)
    .collection("pricing")
    .doc("pricing")
    .get()
    .then((doc) => {
      return res.status(200).json(doc.data()).end();
    })
    .catch((err) => {
      console.log(err);
      return res.json("No pricing available for this photographer.").end();
    });
};

exports.getPhotographerSchedule = (req, res) => {
  let photographerBooked = req.params.photographerId;

  db.collection("photographer")
    .doc(photographerBooked)
    .collection("bookings")
    .get()
    .then((snapshot) => {
      timings = [];

      snapshot.forEach((doc) => {
        var theDay = doc.id;
        var timingsForEachDay = { [theDay]: doc.data() };
        timings.push(timingsForEachDay);
      });

      return res.status(200).json(timings).end();
    })
    .catch(() => {
      console.log("Error getting documents", err);
      return res.json("No book times available.").end();
    });
};

exports.checkBookAbility = (req, res) => {
  db.collection("users")
    .doc(req.user.uid)
    .collection("orders")
    .get()
    .then((sub) => {
      if (sub.docs.length > 0) {
        return res.json({ message: false }).end();
      } else {
        return res.json({ message: true }).end();
      }
    });
};

function checkReviewExists(photographerBeingReviewed, userID) {
  return db
    .collection("photographer")
    .doc(photographerBeingReviewed)
    .collection("reviews")
    .doc(userID)
    .get()
    .then((doc) => {
      if (doc.exists) return true;
      else return false;
    });
}
