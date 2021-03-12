const { index } = require("../util/admin");

exports.saveObjectToAlgolia = (object) => {
  index
    .saveObject(object)
    .then(() => {})
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.partialUpdateObjectToAlgolia = (object) => {
  index
    .partialUpdateObject(object)
    .then(() => {})
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
