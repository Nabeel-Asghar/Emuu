const { admin, db } = require("./admin");

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db.collection("users").doc(req.user.uid).get();
    })
    .then((doc) => {
      res.locals.photographer = doc.data().photographer;
      return next();
    })
    .catch((err) => {
      console.error("Error verifying token", err);
      return res.status(403).json("Invalid login token");
    });
};
