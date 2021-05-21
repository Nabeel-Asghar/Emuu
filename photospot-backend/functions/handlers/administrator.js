const { admin, db } = require("../util/admin");

function deleteJob(id) {
  db.collection("scheduler").doc(id).delete();
}

exports.deleteJob = deleteJob;
