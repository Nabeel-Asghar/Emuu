const { db } = require("../util/admin");

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
  let userid = req.user.uid;
  let reviewID = req.user.uid;
  let photographerBeingReviewed = req.params.photographerId;

  if (reviewID === photographerBeingReviewed) {
    return res.status(400).json({ error: "You cannot review yourself." });
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
                console.log("added review to user");
                return res.json({
                  message: "Review added successfully!",
                });
              })
              .catch((err) => {
                res.status(500).json({ error: `something went wrong` });
              });
          })
          .catch((err) => {
            res.status(500).json({ error: `something went wrong` });
          });

        // Also add that review to the users collection for future reference
      }
    });
};

exports.getSpecificPhotographer = (req, res) => {
  let photographerIdOfPageClicked = req.params.photographerId;

  db.collection("photographer")
    .doc(photographerIdOfPageClicked)
    .get()
    .then((doc) => {
      console.log(photographerIdOfPageClicked);

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
      console.log(photographers);
      return res.json(photographers);
    })
    .catch((err) => console.error(err));
};

exports.bookPhotographer = (req, res) => {
  let userid = req.user.uid;
  let photographerBooked = req.params.photographerId;
  let shootDate = req.body.date;
  let shootTime = req.body.time;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let profileImage = req.body.profileImage;

  let booking = {
    photographerID: photographerBooked,
    consumerID: userid,
    shootDate: shootDate,
    shootTime: shootTime,
    firstName: firstName,
    lastName: lastName,
    profileImage: profileImage,
    paymentStatus: "pending",
    paymentToPhotographer: "pending",
    createdAt: new Date().toISOString(),
  };

  // Make sure user only as one order at a time
  db.collection("allOrders")
    .doc(userid)
    .collection("currentOrders")
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.json({
          message: "You may only have one pending order at a time.",
        });
      }
    });

  // Update booking time to be filled on photographer schedule
  db.collection("photographer")
    .doc(photographerBooked)
    .collection("bookings")
    .doc(shootDate)
    .update({
      [shootTime]: true,
    })
    .then(() => {
      // Set order for photographer under allOrders/{photographerID}/currentOrders
      db.collection("allOrders")
        .doc(photographerBooked)
        .collection("currentOrders")
        .doc()
        .set(booking)
        .then(() => {
          // Set order for user under allOrders/{userID}/currentOrders
          db.collection("allOrders")
            .doc(userid)
            .collection("currentOrders")
            .doc(photographerBooked)
            .set(booking)
            .then(() => {
              return res
                .json({
                  message:
                    "Order complete, you will recieve an email with a confirmation.",
                })
                .catch(() => {
                  return res
                    .status(500)
                    .json({ error: `Something went wrong.` });
                });
            })
            .catch((err) => {
              return res.status(500).json({ error: `Something went wrong.` });
            });
        })
        .catch((err) => {
          return res.status(500).json({ error: `Something went wrong.` });
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
    });
};
