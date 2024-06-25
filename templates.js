// Description: This file contains the template data for the CLI.

// List of folders to create
const folders = ["tokens", "config"];

// JSON object for the config.json file
const configjson = {
  name: "AppConfigCLI",
  version: "1.0.0",
  description: "The Command Line Interface (CLI) for the MyApp.",
  main: "PO.js",
  superuser: "adm1n",
  database: "exampledb",
};

// JSON object for the tokens.json file
const tokenjson = [
  {
    created: "1969-01-31 12:30:00",
    username: "username",
    email: "user@example.com",
    phone: "5556597890",
    token: "token",
    expires: "1969-02-03 12:30:00",
    confirmed: "tbd",
  },
];

module.exports = {
  folders,
  configjson,
  tokenjson,
};
