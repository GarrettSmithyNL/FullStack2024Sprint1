global.DEBUG = false;

const fs = require("fs");
const { checkAppInit } = require("./init.js");

const myArgs = process.argv.slice(2);

if (DEBUG && myArgs.length >= 1) console.log("My Args: " + myArgs);

switch (myArgs[0]) {
  case "init":
  case "i":
    if (DEBUG) console.log(myArgs[0], '- checking app initialization....');
    checkAppInit();
    break;
  case "config":
  case "c":
    break;
  case "token":
  case "t":
    break;
  case "--help":
  case "--h":
  default:
}

