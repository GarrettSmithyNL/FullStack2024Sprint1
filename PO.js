global.DEBUG = false;

const fs = require("fs");

const myArgs = process.argv.slice(2);

if (DEBUG && myArgs.length >= 1) console.log("My Args: " + myArgs);

switch (myArgs[0]) {
  case "init":
  case "i":
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
