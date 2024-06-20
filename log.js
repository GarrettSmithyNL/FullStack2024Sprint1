const fs = require("fs");
const { getYear, format } = require("date-fns");
const fsPromise = require("fs").promises;
const path = require("path");
const emitter = require("./emitter.js");

let createLogFolders = async (logItem) => {
  try {
    const currentFolder = "logs/" + getYear(new Date());
    if (!fs.existsSync(path.join(__dirname, "logs/"))) {
      await fsPromise.mkdir(path.join(__dirname, "logs/"));
      if (!fs.existsSync(path.join(__dirname, currentFolder))) {
        await fsPromise.mkdir(path.join(__dirname, currentFolder));
      }
    } else {
      if (!fs.existsSync(path.join(__dirname, currentFolder))) {
        await fsPromise.mkdir(__dirname, currentFolder);
      }
    }
    createLogFile(logItem, currentFolder);
  } catch {
    emitter.emit("error", "ERROR", "Problem create/appending file.");
  }
};

let createLogFile = async (logItem, currentFolder) => {
  const fileName = `${format(new Date(), "yyyyMMdd")}` + "events.log";
  await fsPromise.appendFile(
    path.join(__dirname, currentFolder, fileName),
    logItem + "\n"
  );
};

module.exports.createLogFolders = createLogFolders;
