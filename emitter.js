const EventEmitter = require("events");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const { createLogFolders } = require("./log.js");

// Create a new class that extends EventEmitter
class MyEmitter extends EventEmitter {}
// Create a new instance of the MyEmitter class
const emitter = new MyEmitter();

// Listen for the "event" event
emitter.on("event", async (event, message) => {
  // Create a date and time string
  const dateTime = `${format(new Date(), "yyyyMMdd HH:mm:ss")}`;
  // Create a log item
  const logItem = `${dateTime} - ${event} - ${message} - ${uuid()}`;
  // Create the log folders
  createLogFolders(logItem);
});

emitter.on("error", async (event, message) => {
  // Create a date and time string
  const dateTime = `${format(new Date(), "yyyyMMdd HH:mm:ss")}`;
  // Create a log item
  const logItem = `${dateTime} - ${event} - ${message} - ${uuid()}`;
  // Create the log folders
  createLogFolders(logItem);
});

module.exports = emitter;
