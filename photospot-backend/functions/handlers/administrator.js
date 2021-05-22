const { admin, db } = require("../util/admin");

async function completeJob(id, data) {
  try {
    await db.collection("completedJobs").doc(id).set(data);
    await db.collection("scheduler").doc(id).delete();
    return true;
  } catch (e) {
    console.log("Error completing job: ", e);
    return false;
  }
}

exports.completeJob = completeJob;
