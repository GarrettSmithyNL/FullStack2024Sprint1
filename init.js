const myArgs = process.argv.slice(2);
const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

const emitter = require("./emitter.js");

const { folders, configjson, tokenjson } = require("./templates.js");

function checkAppInit() {
  if (fs.existsSync("./PO.js")) {
    console.log("Init has been run previously");
  } else {
    console.log("Init has not been run yet");
  }
}

let createFolders = () => {
  let mkCount = 0;
  folders.forEach((folder) => {
    try {
      if (!fs.existsSync(path.join(__dirname, folder))) {
        fsPromise.mkdir(path.join(__dirname, folder));
        mkCount++;
      }
    } catch {
      emitter.emit("error", "ERROR", `Error creating ${folder} folder.`);
    }
  });

  if (mkCount === 0) {
    console.log("All folder alreat exist.");
  } else if (mkCount < folders.length) {
    console.log(mkCount + " of " + folders.length + "folders were created.");
  } else {
    console.log("All folders created.");
  }
};

let createFiles = () => {
  // Creates files
  // Add other files here
  // Creates users.json
  try {
    let tokenData = JSON.stringify(tokenjson, null, 2);
    if (!fs.existsSync(path.join(__dirname, "./tokens/tokens.json"))) {
      fs.writeFile("./tokens/tokens.json", tokenData, (error) => {
        if (error) {
          emitter.emit("error", "ERROR", `Error creating tokens.json.`);
        } else {
          console.log("Data written to tokens file.");
        }
      });
    } else {
      console.log("tokens.json already created.");
    }
  } catch {
    emitter.emit("error", "ERROR", `Error creating files.`);
  }
};

let initalizeApp = () => {
  if (DEBUG) console.log("initializeApp()");
  switch (myArgs[1]) {
    case "--all":
      if (DEBUG) console.log("--all createFolders() & createFiles()");
      createFolders();
      createFiles();
      emitter.emit("event", "EVENT", `Created all the files and folders.`);
      break;
    case "--mk":
      if (DEBUG) console.log("--mk createFolders()");
      createFolders();
      emitter.emit("event", "EVENT", `Created all folders.`);
      break;
    case "--cat":
      if (DEBUG) console.log("--cat createFiles()");
      createFiles();
      emitter.emit("event", "EVENT", `Created all files.`);
      break;
  }
};

module.exports = {
  checkAppInit,
  initalizeApp,
};
