const { admin, db } = require("../util/admin");

exports.completedOrders = (req, res) => {
  db.collection("orders")
    .where("paymentToPhotographer", "==", "completed")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
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
