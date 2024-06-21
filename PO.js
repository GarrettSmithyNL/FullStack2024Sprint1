global.DEBUG = false;

const fs = require("fs");
const { checkAppInit } = require("./init.js");


const emitter = require("./emitter.js");


const myArgs = process.argv.slice(2);

if (DEBUG && myArgs.length >= 1) console.log("My Args: " + myArgs);

switch (myArgs[0]) {
  case "init":
  case "i":
    if (DEBUG) console.log(myArgs[0], '- checking app initialization....');
    checkAppInit();
    emitter.emit("event", "EVENT", "Called init");
    break;
  case "config":
  case "c":
    emitter.emit("event", "EVENT", "Called config");
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(myArgs[0], '- tokenApp called');
    emitter.emit("event", "EVENT", "Called token");
    break;
  case "--help":
  case "--h":
    emitter.emit("event", "EVENT", "Called --help");
  default:
}

