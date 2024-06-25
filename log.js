const fs = require("fs");
const { getYear, format } = require("date-fns");
const fsPromise = require("fs").promises;
const path = require("path");
const emitter = require("./emitter.js");

let createLogFolders = async (logItem) => {
  // Create the log folders
  try {
    // Create the name of the current folder
    const currentFolder = "logs/" + getYear(new Date());
    // Check if the logs folder exists
    if (!fs.existsSync(path.join(__dirname, "logs/"))) {
      // If the logs folder does not exist, create it
      await fsPromise.mkdir(path.join(__dirname, "logs/"));
      // Check if the current folder exists
      if (!fs.existsSync(path.join(__dirname, currentFolder))) {
        // If the current folder does not exist, create it
        await fsPromise.mkdir(path.join(__dirname, currentFolder));
      }
    } else {
      // Check if the current folder exists
      if (!fs.existsSync(path.join(__dirname, currentFolder))) {
        // If the current folder does not exist, create it
        await fsPromise.mkdir(__dirname, currentFolder);
      }
    }
    // Create the log file
    createLogFile(logItem, currentFolder);
  } catch {
    // If there is an error creating the log folders, emit an error event
    emitter.emit("error", "ERROR", "Problem create/appending file.");
  }
};

let createLogFile = async (logItem, currentFolder) => {
  // Create the log file
  const fileName = `${format(new Date(), "yyyyMMdd")}` + "events.log";
  // Append the log item to the log file
  await fsPromise.appendFile(
    path.join(__dirname, currentFolder, fileName),
    logItem + "\n"
  );
};

module.exports.createLogFolders = createLogFolders;
