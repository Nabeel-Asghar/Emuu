const { db, db2 } = require("../util/admin");
const admin = require("../util/admin");

exports.getMessages = (req, res) => {
  console.log("getMessages");
  let userEmail = req.user.email;
  let chats = [];
  db.collection("chats")
    .where("users", "array-contains", userEmail)
    .onSnapshot((doc) => {
      chats = doc.docs.map((_doc) => _doc.data());
      console.log(chats);
      return res.send(chats);
    });
};

exports.sendMessage = (req, res) => {
  let docKey = req.params.docKey;
  let message = req.body.message;
  let email = req.body.email;
  console.log("sendMessage");

  db.collection("chats")
    .doc(docKey)
    .update({
      messages: db2.FieldValue.arrayUnion({
        sender: email,
        message: message,
      }),
      //receiverHasRead: false,
    })
    .catch((err) => {
      //res.status(500).json({ error: `something went wrong` });
      console.log("errror", err);
    });

  return res.json({
    message: "Message sent!",
  });
};
