const { checkAppInit, initalizeApp } = require("./init.js");
const { tokens } = require("./token.js");
const { config } = require("./config.js");
const emitter = require("./emitter.js");

const poHelp = `
PO <command> <option>

Usage:

PO --help                              displays all help

PO init --help                         displays help for the init command
PO init --all                          creates the folder structure and config and tokens files
PO init --mk                           creates the folder structure
PO init --cat                          creates the config file with default settings and the tokens file

PO config --help                       displays help for the config command
PO config --show                       displays a list of the current config settings
PO config --reset                      resets the config file to the default settings
PO config --set <option> <value>       sets a specific config setting

PO token --help                        displays help for the init command
PO token --count                       displays the count of the tokens created
PO token --new <username>              generates a new token for the given username
PO token --upd p <username> <phone>    updates the json entry with a new phone number
PO token --upd e <username> <email>    updates the json entry with a new email
PO token --search u <username>         fetches a token for a given username
PO token --search e <email>            fetches a token for a given email
PO token --search p <phone>            fetches a token for a given phone number
`;

// Get the command line arguments
const myArgs = process.argv.slice(2);

switch (myArgs[0]) {
  case "init":
  case "i":
    // Option for initializing the app
    checkAppInit();
    initalizeApp();
    emitter.emit("event", "EVENT", "Called init");
    break;
  case "config":
  case "c":
    // Option for setting the config
    config();
    emitter.emit("event", "EVENT", "Called config");
    break;
  case "token":
  case "t":
    // Option for setting the tokens
    tokens();
    emitter.emit("event", "EVENT", "Called token");
    break;
  case "--help":
  case "--h":
    // Option for displaying help
    console.log(poHelp);
    emitter.emit("event", "EVENT", "Called --help");
  default:
}
