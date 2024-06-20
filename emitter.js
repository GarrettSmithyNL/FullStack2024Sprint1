const EventEmitter = require("events");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const { createLogFolders } = require("./log.js");

class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

emitter.on("event", async (event, message) => {
  const dateTime = `${format(new Date(), "yyyyMMdd HH:mm:ss")}`;
  const logItem = `${dateTime} - ${event} - ${message} - ${uuid()}`;
  createLogFolders(logItem);
});

emitter.on("error", async (event, message) => {
  const dateTime = `${format(new Date(), "yyyyMMdd HH:mm:ss")}`;
  const logItem = `${dateTime} - ${event} - ${message} - ${uuid()}`;
  createLogFolders(logItem);
});

module.exports = emitter;
