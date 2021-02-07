var fs = require("fs");
var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });

exports.logToFile = (data) => {
  //
  log_file.write(util.format(data) + "\n");
};
