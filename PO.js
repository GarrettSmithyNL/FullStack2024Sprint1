global.DEBUG = false;

const fs = require("fs");

const emitter = require("./emitter.js");

const myArgs = process.argv.slice(2);

if (DEBUG && myArgs.length >= 1) console.log("My Args: " + myArgs);

switch (myArgs[0]) {
  case "init":
  case "i":
    emitter.emit("event", "EVENT", "Called init");
    break;
  case "config":
  case "c":
    emitter.emit("event", "EVENT", "Called config");
    break;
  case "token":
  case "t":
    emitter.emit("event", "EVENT", "Called token");
    break;
  case "--help":
  case "--h":
    emitter.emit("event", "EVENT", "Called --help");
  default:
}
