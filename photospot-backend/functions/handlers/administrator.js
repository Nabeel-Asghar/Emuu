const { admin, db } = require("../util/admin");

function completeJob(id) {
  try {
    db.collection("scheduler")
      .doc(id)
      .get()
      .then(async (doc) => {
        await db.collection("completedJobs").doc(id).set(doc.data());
        await db.collection("scheduler").doc(id).delete();
      })
      .finally(() => {
        return true;
      });
  } catch (e) {
    console.log("Error completing job: ", e);
    return false;
  }
}

exports.completeJob = completeJob;
