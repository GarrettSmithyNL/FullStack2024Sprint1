#!/usr/bin/env node
// for cross platform compatibility

// Import necessary modules
const fs = require("fs");
const path = require("path");
const { configjson } = require("./templates.js"); // Import the config template from templates.js
const emitter = require("./emitter.js");

const configHelp = `
Usage:

PO config --help                       displays help for the config command
PO config --show                       displays a list of the current config settings
PO config --reset                      resets the config file to the default settings
PO config --set <option> <value>       sets a specific config setting
`;

// Get command line arguments and the command to execute
const args = process.argv.slice(2);

// Ensure that the config file exists, if not create it using the default template
const ensureConfigFileExists = () => {
  if (!fs.existsSync(path.join(__dirname, "/config/config.json"))) {
    console.log(
      `Config file not found. Creating default config at ${configPath}`
    );
    fs.writeFileSync(
      path.join(__dirname, "/config/config.json"),
      JSON.stringify(configjson, null, 2)
    );
  }
};

// Read and display the contents of the config file
const readConfig = () => {
  ensureConfigFileExists();
  fs.readFile(
    path.join(__dirname, "/config/config.json"),
    "utf8",
    (error, data) => {
      if (error) {
        emitter.emit("error", "ERROR", "Error reading config file.");
      } else {
        console.log("Config file content:\n", data);
        emitter.emit("event", "EVENT", "Config file read.");
      }
    }
  );
};

// Update a specific key-value pair in the config file
const updateConfig = (key, value) => {
  ensureConfigFileExists();
  fs.readFile(
    path.join(__dirname, "/config/config.json"),
    "utf8",
    (error, data) => {
      if (error) {
        emitter.emit("error", "ERROR", "Error reading config file.");
      } else {
        const config = JSON.parse(data);
        switch (key) {
          case "name":
            config.name = value;
            break;
          case "version":
            config.version = value;
            break;
          case "description":
            config.description = value;
            break;
          case "main":
            config.main = value;
            break;
          case "superuser":
            config.superuser = value;
            break;
          case "database":
            config.database = value;
            break;
        }
        fs.writeFile(
          path.join(__dirname, "/config/config.json"),
          JSON.stringify(config, null, 2),
          (error) => {
            if (error) {
              emitter.emit("error", "ERROR", "Error updating config file.");
            } else {
              console.log("Config file updated successfully");
              emitter.emit("event", "UPDATE", "Config file updated.");
            }
          }
        );
      }
    }
  );
};

// Reset the config file to the default configuration from the template
const resetConfig = () => {
  fs.writeFile(
    path.join(__dirname, "/config/config.json"),
    JSON.stringify(configjson, null, 2),
    (error) => {
      if (error) {
        emitter.emit("error", "ERROR", "Error resetting config file.");
      } else {
        console.log("Config file reset successfully");
        emitter.emit("event", "UPDATE", "Config file reset.");
      }
    }
  );
};

let config = () => {
  // Execute the appropriate function based on the command
  switch (args[1]) {
    case "--help":
      console.log(configHelp);
      emitter.emit("event", "HELP", "Called config help");
      break;
    case "--show":
      readConfig();
      emitter.emit("event", "EVENT", "Called show config");
      break;
    case "--set":
      updateConfig(args[2], args[3]);
      emitter.emit("event", "EVENT", "Called set config");
      break;
    case "--reset":
      resetConfig();
      emitter.emit("event", "EVENT", "Called reset config");
      break;
    default:
      console.error(
        'Unknown command. Use "help", "view", "update <key> <value>", or "reset".'
      );
      emitter.emit("error", "ERROR", "Unknown command in config");
      break;
  }
};

module.exports = {
  config,
};
