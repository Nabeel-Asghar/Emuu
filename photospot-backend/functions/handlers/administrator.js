const { admin, db } = require("../util/admin");

exports.completedOrders = (req, res) => {
  db.collection("orders")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (
          doc.data().paymentStatus == "completed" &&
          doc.data().paymentToPhotographer == "completed"
        ) {
          let userid = doc.data().consumer;
          let photographerBooked = doc.data().photographer;
          let location = doc.data().location;
          let shootDate = doc.data().shootDate;
          let dateOrdered = doc.data().createdAt;

          db.collection("completedOrders")
            .doc(userid)
            .set({
              userid: userid,
              photographer: photographerBooked,
              location: location,
              shoottDate: shootDate,
              dateOrdered: dateOrdered,
              dateCompleted: new Date().toISOString(),
              paymentStatus: "completed",
              paymentToPhotographer: "completed",
            })
            .then(() => {
              db.collection("orders").doc(userid).delete();
            })
            .catch((err) => {
              console.error(err);
              return res.status(500).json({ error: err.code });
            });
        } else {
          return res.json({
            message: "no orders to be completed at this time.",
          });
        }
      });
    })
    .then(() => {
      return res.json({ message: "Completed orders" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
