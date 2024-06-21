global.DEBUG = false;

const { checkAppInit, initalizeApp } = require("./init.js");
const emitter = require("./emitter.js");
const { tokens } = require("./token.js");

const myArgs = process.argv.slice(2);

if (DEBUG && myArgs.length >= 1) console.log("My Args: " + myArgs);

switch (myArgs[0]) {
  case "init":
  case "i":
    if (DEBUG) console.log(myArgs[0], "- checking app initialization....");
    checkAppInit();
    initalizeApp();
    break;
  case "config":
  case "c":
    emitter.emit("event", "EVENT", "Called config");
    break;
  case "token":
  case "t":
    tokens();
    emitter.emit("event", "EVENT", "Called token");
    break;
  case "--help":
  case "--h":
    emitter.emit("event", "EVENT", "Called --help");
  default:
}
