const { db, db2 } = require("../util/admin");

const { validateReview } = require("../util/validators");

exports.getAllPhotographers = (req, res) => {
  db.collection("photographer")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let posts = [];

      data.forEach((doc) => {
        posts.push({
          photographerID: doc.id,
          email: doc.data().email,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          location_city: doc.data().location_city,
          location_state: doc.data().location_state,
          profileImage: doc.data().profileImage,
          images: doc.data().images,
          createdAt: doc.data().createdAt,
          headline: doc.data().headline,
          camera: doc.data().camera,
          instagram: doc.data().instagram,
          company: doc.data().company,
          reviewCount: doc.data().reviewCount,
          totalRating: doc.data().totalRating,
        });
      });
      return res.json(posts);
    })
    .catch((err) => console.error(err));
};

exports.createPost = (req, res) => {
  if (isEmpty(req.body.body)) {
    return res.status(400).json("Body must not be empty");
  }

  const newPost = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
  };

  db.collection("posts")
    .add(newPost)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully!` });
    })
    .catch((err) => {
      res.status(500).json({ error: `something went wrong` });
      console.log(err);
    });
};

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

exports.reviewPhotographer = (req, res) => {
  let description = req.body.description || "";
  let rating = req.body.rating || "";
  let title = req.body.title || "";
  let userid = req.user.uid;
  let reviewID = req.user.uid;
  let photographerBeingReviewed = req.params.photographerId;
  let photographerFirstName = req.body.photographerFirstName;
  let photographerLastName = req.body.photographerLastName;
  let photographerProfile = req.body.photographerProfile;
  let reviewTotal = 1;
  let reviewCount = 1;

  if (reviewID === photographerBeingReviewed) {
    return res.status(400).json({ error: "You cannot review yourself." });
  }

  if (title.isEmpty || title.length < 5) {
    return res.status(400).json({
      title: "The title of your review must be longer than 5 characters.",
    });
  }

  if (description.isEmpty || description.length < 10) {
    return res.status(400).json({
      description:
        "The description of your review must be longer than 10 characters.",
    });
  }

  db.collection("photographer")
    .doc(photographerBeingReviewed)
    .collection("reviews")
    .doc(userid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("cannot review twice");
        return res
          .status(400)
          .json({ error: "You cannot review someone twice." });
      } else {
        const newReview = {
          description: req.body.description,
          rating: req.body.rating,
          title: req.body.title,
          userID: userid,
          photographerID: photographerBeingReviewed,
          firstName: res.locals.firstName,
          lastName: res.locals.lastName,
          photographerFirstName: photographerFirstName,
          photographerLastName: photographerLastName,
          photographerProfile: photographerProfile,
          createdAt: new Date().toISOString(),
        };

        const { valid, errors } = validateReview(newReview);
        console.log("errors: ", errors);

        if (!valid) return res.status(400).json(errors);

        // Add review to that photographer document

        db.collection("photographer")
          .doc(photographerBeingReviewed)
          .collection("reviews")
          .doc(userid)
          .set(newReview)
          .then(() => {
            db.collection("users")
              .doc(userid)
              .collection("reviews")
              .doc(photographerBeingReviewed)
              .set(newReview)
              .then(() => {
                const pRef = db
                  .collection("photographer")
                  .doc(photographerBeingReviewed);

                return db.runTransaction((transaction) => {
                  return transaction.get(pRef).then((document) => {
                    if (!document.exists) {
                      throw "Document does not exist!";
                    }

                    // Compute new number of ratings
                    var newNumRatings = document.data().reviewCount + 1;

                    // Compute new average rating
                    var oldRatingTotal =
                      document.data().totalRating + req.body.rating;
                    var newAvgRating = oldRatingTotal / newNumRatings;

                    // Commit to Firestore
                    transaction.update(pRef, {
                      reviewCount: newNumRatings,
                      totalRating: oldRatingTotal,
                      avgRating: newAvgRating,
                    });
                    console.log("added review to user");
                    return res.json({ message: "Review added successfully!" });
                  });
                });

                // const pRef = db
                //   .collection("photographer")
                //   .doc(photographerBeingReviewed);

                // const incrementReviewCount = db2.FieldValue.increment(1);
                // const incrementRating = db2.FieldValue.increment(
                //   req.body.rating
                // );

                // pRef.get().then((doc) => {
                //   const totalRating1 = doc.data().totalRating
                //     ? doc.data().totalRating
                //     : 0;
                //   const reviewCount1 = doc.data().reviewCount
                //     ? doc.data().reviewCount
                //     : 0;

                //   console.log("total:", totalRating1);
                //   console.log("reviewCount:", reviewCount1);
                //   pRef.update({
                //     averageRating:
                //       (totalRating1 + req.body.rating) / (reviewCount1 + 1),
                //   });
                // });

                // pRef.update({ reviewCount: incrementReviewCount });
                // pRef.update({ totalRating: incrementRating });

                // console.log("added review to user");

                // return res.json({ message: "Review added successfully!" });
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({ error: `something went wrong` });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: `something went wrong` });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: `something went wrong` });
    });

  // Also add that review to the users collection for future reference
};

exports.editReview = (req, res) => {
  let description = req.body.description || "";
  let rating = req.body.rating || "";
  let title = req.body.title || "";
  let userid = req.user.uid;
  let photographerBeingReviewed = req.body.photographerID;
  let oldRating = req.body.oldRating;

  if (title.isEmpty || title.length < 5) {
    return res.status(400).json({
      title: "The title of your review must be longer than 5 characters.",
    });
  }

  if (description.isEmpty || description.length < 10) {
    return res.status(400).json({
      description:
        "The description of your review must be longer than 10 characters.",
    });
  }

  const updateReview = {
    description: description,
    rating: rating,
    title: title,
  };

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
        .update(updateReview)
        .then(() => {
          const pRef = db
            .collection("photographer")
            .doc(photographerBeingReviewed);

          return db.runTransaction((transaction) => {
            return transaction.get(pRef).then((document) => {
              if (!document.exists) {
                throw "Document does not exist!";
              }

              // Compute new number of ratings
              var newNumRatings = document.data().reviewCount;

              // Compute new average rating
              var oldRatingTotal =
                document.data().totalRating - oldRating + req.body.rating;
              var newAvgRating = oldRatingTotal / newNumRatings;

              // Commit to Firestore
              transaction.update(pRef, {
                reviewCount: newNumRatings,
                totalRating: oldRatingTotal,
                avgRating: newAvgRating,
              });
              return res.json({ message: "Review edited successfully!" });
            });
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ error: `something went wrong` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
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
        .delete()
        .then(() => {
          const pRef = db
            .collection("photographer")
            .doc(photographerBeingReviewed);

          return db.runTransaction((transaction) => {
            return transaction.get(pRef).then((document) => {
              if (!document.exists) {
                throw "Document does not exist!";
              }

              // Compute new number of ratings
              var newNumRatings = document.data().reviewCount - 1;

              // Compute new average rating
              var oldRatingTotal = document.data().totalRating - oldRating;
              var newAvgRating = oldRatingTotal / newNumRatings;

              // Commit to Firestore
              transaction.update(pRef, {
                reviewCount: newNumRatings,
                totalRating: oldRatingTotal,
                avgRating: newAvgRating,
              });
              console.log("Deleted review");
              return res.json({ message: "Review deleted successfully!" });
            });
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ error: `something went wrong` });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

exports.getSpecificPhotographer = (req, res) => {
  let photographerIdOfPageClicked = req.params.photographerId;

  db.collection("photographer")
    .doc(photographerIdOfPageClicked)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.json({ message: "Page not found." });
      }

      let photographer = [];

      photographer.push({
        photographerID: photographerIdOfPageClicked,
        email: doc.data().email,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        profileImage: doc.data().profileImage,
        images: doc.data().images,
        company: doc.data().company,
        bio: doc.data().bio,
        instagram: doc.data().instagram,
        location_city: doc.data().location_city,
        location_state: doc.data().location_state,
        ratePerHour: doc.data().ratePerHour,
        tags: doc.data().tags,
        website: doc.data().website,
        videography: doc.data().videography,
        willingnessToTravel: doc.data().willingnessToTravel,
        createdAt: doc.data().createdAt,
        background: doc.data().background,
        camera: doc.data().camera,
        headline: doc.data().headline,
      });
      return res.json(photographer);
    })
    .catch((err) => {
      res.status(500).json({ error: `Something went wrong.` });
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
      return res.json(doc.data());
    })
    .catch((err) => {
      console.log(err);
      return res.json("No pricing available for this photographer.");
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

      return res.json(timings);
    })
    .catch(() => {
      console.log("Error getting documents", err);
      return res.json("No book times available.");
    });
};

exports.searchPhotographer = (req, res) => {
  var query = req.params.searchQuery;

  db.collection("photographer")
    .orderBy("firstName")
    .where("firstName", ">=", query.toUpperCase())
    .where("firstName", "<=", query.toLowerCase() + "\uf8ff")
    .get()
    .then((data) => {
      let posts = [];

      data.forEach((doc) => {
        posts.push({
          photographerID: doc.id,
          email: doc.data().email,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          location_city: doc.data().location_city,
          location_state: doc.data().location_state,
          profileImage: doc.data().profileImage,
          images: doc.data().images,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(posts);
    })
    .catch((err) => console.error(err));
};

exports.filterPhotographers = (req, res) => {
  const type = req.params.type;
  const city = req.params.city;
  const state = req.params.state;

  db.collection(`photographer/`)
    .where("categories", "array-contains", type)
    .where("location_city", "==", city)
    .where("location_state", "==", state)
    .get()
    .then((data) => {
      let photographers = [];

      data.forEach((doc) => {
        photographers.push({
          photographerID: doc.id,
          email: doc.data().email,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          location_city: doc.data().location_city,
          location_state: doc.data().location_state,
          profileImage: doc.data().profileImage,
          images: doc.data().images,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(photographers);
    })
    .catch((err) => console.error(err));
};

exports.bookPhotographer = (req, res) => {
  let userid = req.user.uid;
  let photographerBooked = req.params.photographerId;
  let shootDate = req.body.date;
  let shootTime = req.body.time;
  let photographerFirstName = req.body.firstName;
  let photographerLastName = req.body.lastName;
  let photographerProfileImage = req.body.profileImage;
  let consumerFirstName = res.locals.firstName;
  let consumerLastName = res.locals.lastName;
  let consumerProfileImage = res.locals.profileImage;

  var myDate = shootDate.split("-");
  var newDate = myDate[2] + "," + myDate[0] + "," + myDate[1];
  var formattedDate = new Date(newDate);

  let booking = {
    photographerID: photographerBooked,
    consumerID: userid,
    shootDate: shootDate,
    shootTime: shootTime,
    photographerFirstName: photographerFirstName,
    photographerLastName: photographerLastName,
    photographerProfileImage: photographerProfileImage,
    consumerFirstName: consumerFirstName,
    consumerLastName: consumerLastName,
    consumerProfileImage: consumerProfileImage,
    paymentStatus: "pending",
    paymentToPhotographer: "pending",
    createdAt: new Date().toISOString(),
    formattedDate: formattedDate,
  };

  // Make sure user only as one order at a time
  db.collection("users")
    .doc(userid)
    .collection("orders")
    .get()
    .then((sub) => {
      console.log("here");
      if (sub.docs.length > 0) {
        return res.status(500).json({
          message: "You may only have one pending order at a time.",
        });
      } else {
        // update main collection of orders with this order
        db.collection("allOrders")
          .doc()
          .set(booking)
          .then(() => {
            // Update booking time to be filled on photographer schedule
            db.collection("photographer")
              .doc(photographerBooked)
              .collection("bookings")
              .doc(shootDate)
              .update({
                [shootTime]: true,
              })
              .then(() => {
                // Set order for photographer under photographer/{photograhper ID}/orders
                db.collection("photographer")
                  .doc(photographerBooked)
                  .collection("orders")
                  .doc()
                  .set(booking)
                  .then(() => {
                    // Set order for user under users/{user ID}/orders
                    db.collection("users")
                      .doc(userid)
                      .collection("orders")
                      .doc(photographerBooked)
                      .set(booking)
                      .then(() => {
                        return res.json({
                          message:
                            "Order complete, you will recieve an email with a confirmation.",
                        });
                      })
                      .catch((err) => {
                        return res
                          .status(500)
                          .json({ error: `Something went wrong.` });
                      });
                  })
                  .catch((err) => {
                    return res
                      .status(500)
                      .json({ error: `Something went wrong.` });
                  });

                // db.collection("orders")
                //   .doc(userid)
                //   .set(booking)
                //   .then(() => {
                //     return res.json({
                //       message:
                //         "Order complete, you will recieve an email with a confirmation.",
                //     });
                //   })
                //   .catch((err) => {
                //     res.status(500).json({ error: `something went wrong` });
                //     console.log(err);
                //   });
              })
              .catch((err) => {
                return res.status(500).json({ error: `Something went wrong.` });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.json({ error: err });
          });
      }
    });
};
