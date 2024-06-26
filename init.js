const myArgs = process.argv.slice(2);
const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const emitter = require("./emitter.js");
const { folders, configjson, tokenjson } = require("./templates.js");

const initHelp = `
Usage:

PO init --help                         displays help for the init command
PO init --all                          creates the folder structure and config and tokens files
PO init --mk                           creates the folder structure
PO init --cat                          creates the config file with default settings and the tokens file
`;

function checkAppInit() {
  // Check if the init has been run
  if (fs.existsSync("./PO.js")) {
    // If the init has been run, emit an event
    console.log("Init has been run previously");
  } else {
    // If the init has not been run, emit an error
    console.log("Init has not been run yet");
  }
}

let createFolders = () => {
  // Count of folders created
  let mkCount = 0;

  // Create folders
  folders.forEach((folder) => {
    try {
      // Check if the folder exists
      if (!fs.existsSync(path.join(__dirname, folder))) {
        // If the folder does not exist, create it
        fsPromise.mkdir(path.join(__dirname, folder));
        // Increment the count of folders created
        mkCount++;
      }
    } catch {
      // If there is an error creating the folder, emit an error event
      emitter.emit("error", "ERROR", `Error creating ${folder} folder.`);
    }
  });

  if (mkCount === 0) {
    // If no folders were created, emit an event
    console.log("All folder already exist.");
  } else if (mkCount < folders.length) {
    // If some folders were created, emit an event
    console.log(mkCount + " of " + folders.length + "folders were created.");
  } else {
    // If all folders were created, emit an event
    console.log("All folders created.");
  }
};

let createFiles = () => {
  try {
    // Create the tokens.json file
    let tokenData = JSON.stringify(tokenjson, null, 2);
    if (!fs.existsSync(path.join(__dirname, "./tokens/tokens.json"))) {
      // If the tokens.json file does not exist, create it
      fs.writeFile("./tokens/tokens.json", tokenData, (error) => {
        if (error) {
          // If there is an error creating the tokens.json file, emit an error event
          emitter.emit("error", "ERROR", `Error creating tokens.json.`);
        } else {
          // If there is no error, log a message that the data was written to the tokens file
          console.log("Data written to tokens file.");
        }
      });
    } else {
      // If the tokens.json file already exists, log a message
      console.log("tokens.json already created.");
    }
    let configData = JSON.stringify(configjson, null, 2);
    if (!fs.existsSync(path.join(__dirname, "./config/config.json"))) {
      // If the tokens.json file does not exist, create it
      fs.writeFile("./config/config.json", configData, (error) => {
        if (error) {
          // If there is an error creating the tokens.json file, emit an error event
          emitter.emit("error", "ERROR", `Error creating config.json.`);
        } else {
          // If there is no error, log a message that the data was written to the tokens file
          console.log("Data written to config file.");
        }
      });
    } else {
      // If the tokens.json file already exists, log a message
      console.log("config.json already created.");
    }
  } catch {
    // If there is an error creating the tokens.json file, emit an error event
    emitter.emit("error", "ERROR", `Error creating files.`);
  }
};

let initalizeApp = () => {
  // Initialize the app
  switch (myArgs[1]) {
    case "--help":
      // Display help for the init command
      console.log(initHelp);
      emitter.emit("event", "HELP", `Displayed help for the init command.`);
      break;
    case "--all":
      // Create all folders and files
      createFolders();
      createFiles();
      emitter.emit("event", "CREATE", `Created all the files and folders.`);
      break;
    case "--mk":
      // Create all folders
      createFolders();
      emitter.emit("event", "CREATE", `Created all folders.`);
      break;
    case "--cat":
      // Create all files
      createFiles();
      emitter.emit("event", "CREATE", `Created all files.`);
      break;
  }
};

module.exports = {
  checkAppInit,
  initalizeApp,
};
