#!/usr/bin/env node
// for cross platform compatibility

// Import necessary modules
const fs = require('fs');
const path = require('path');
const { configjson } = require('./templates.js'); // Import the config template from templates.js
const configPath = path.join(__dirname, 'config.json'); // Define the path to the config file

// Get command line arguments and the command to execute
const args = process.argv.slice(2);
const command = args[0];

// Ensure that the config file exists, if not create it using the default template
const ensureConfigFileExists = () => {
  if (!fs.existsSync(configPath)) {
    console.log(`Config file not found. Creating default config at ${configPath}`);
    fs.writeFileSync(configPath, JSON.stringify(configjson, null, 2));
  }
};

// Read and display the contents of the config file
const readConfig = () => {
  ensureConfigFileExists();
  console.log(`Attempting to read config file from ${configPath}`);
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      process.exit(1);
    } else {
      console.log('Config file content:\n', data);
    }
  });
};

// Update a specific key-value pair in the config file
const updateConfig = (key, value) => {
  ensureConfigFileExists();
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      process.exit(1);
    } else {
      const config = JSON.parse(data);
      config[key] = value;
      fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
        if (err) {
          console.error('Error writing config file:', err);
          process.exit(1);
        } else {
          console.log('Config file updated successfully');
        }
      });
    }
  });
};

// Reset the config file to the default configuration from the template
const resetConfig = () => {
  fs.writeFile(configPath, JSON.stringify(configjson, null, 2), (err) => {
    if (err) {
      console.error('Error resetting config file:', err);
      process.exit(1);
    } else {
      console.log('Config file reset successfully');
    }
  });
};

// Print the command being executed
console.log(`Running command: ${command}`);

// Execute the appropriate function based on the command
switch (command) {
  case 'view':
    readConfig();
    break;
  case 'update':
    const key = args[1];
    const value = args[2];
    if (!key || !value) {
      console.error('Usage: update <key> <value>');
      process.exit(1);
    } else {
      updateConfig(key, value);
    }
    break;
  case 'reset':
    resetConfig();
    break;
  default:
    console.error('Unknown command. Use "view", "update <key> <value>", or "reset".');
    process.exit(1);
}





