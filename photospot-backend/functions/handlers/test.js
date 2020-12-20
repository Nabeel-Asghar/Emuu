const moment = require("moment");
const { db, admin } = require("../util/admin");

exports.testFunction = (req, res) => {
  let theDate = new Date();
  theDate.setDate(theDate.getDate() + 2);
  console.log(theDate);
  db.collection("scheduler")
    .doc()
    .set({
      formatted: theDate,
      regular: admin.firestore.Timestamp.now(),
    })
    .then(() => {
      return res.json({ res: "true" });
    });
};
