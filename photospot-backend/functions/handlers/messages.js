const { db } = require("../util/admin");

exports.getMessages = (req, res) => {
  let userEmail = req.user.email;
  let chats = [];
  db.collection("chats")
    .where("users", "array-contains", userEmail)
    .onSnapshot((doc) => {
      chats = doc.docs.map((_doc) => _doc.data());
      console.log("gay", chats);
      return res.send(chats);
    });
};
