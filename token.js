const myArgs = process.argv.slice(2);
const { format, addDays } = require("date-fns");
const { crc32 } = require("crc");
const fs = require("fs");
const path = require("path");
const emitter = require("./emitter.js");

const tokenHelp = `
Usage:

PO token --help                        displays help for the init command
PO token --count                       displays the count of the tokens created
PO token --new <username>              generates a new token for the given username
PO token --upd p <username> <phone>    updates the json entry with a new phone number
PO token --upd e <username> <email>    updates the json entry with a new email
PO token --search u <username>         fetches a token for a given username
PO token --search e <email>            fetches a token for a given email
PO token --search p <phone>            fetches a token for a given phone number
`;

let tokenNew = (newUsername) => {
  // Create a new token for the given username
  let newToken = JSON.parse(`{
      "created": "1969-01-31 12:30:00",
      "username": "username",
      "email": "user@example.com",
      "phone": "5556597890",
      "token": "token",
      "expires": "1969-02-03 12:30:00",
      "confirmed": "tbd"
  }`);

  // Update the new token with the current date and time
  newToken.created = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  // Update the new token with the given username
  newToken.username = newUsername;
  // Update the expires date to 3 days from the current date
  newToken.expires = format(addDays(new Date(), 3), "yyyy-MM-dd HH:mm:ss");
  // Update the new token with the token
  newToken.token = crc32(newUsername).toString(8);

  // Read the tokens.json file
  fs.readFile(__dirname + "/tokens/tokens.json", "utf-8", (error, data) => {
    // If there is an error, emit an error event
    if (error) emitter.emit("error", "ERROR", "Problem reading tokens.json.");
    // Parse the data from the tokens.json file
    let tokens = JSON.parse(data);
    // Push the new token to the tokens array
    tokens.push(newToken);
    // Pretty-print the JSON with an indentation of 2 spaces
    let updatedTokens = JSON.stringify(tokens, null, 2);
    // Write the updated tokens array to the tokens.json file
    fs.writeFile(__dirname + "/tokens/tokens.json", updatedTokens, (error) => {
      // If there is an error, emit an error event
      if (error)
        emitter.emit("error", "ERROR", "Problem updating tokens.json.");
      else {
        // If there is no error, log a message that a new token was created
        console.log(`New token was created for ${newToken.username}.`);
      }
    });
  });
};

let tokenUpdate = (updateType, userName, newData) => {
  // Check if the update type is either "p" or "e"
  if (updateType !== "p" && updateType !== "e") {
    console.log(`Not a valid argument. Please use 'PO token --help'`);
  } else {
    // Read the tokens.json file
    fs.readFile(__dirname + "/tokens/tokens.json", "utf-8", (error, data) => {
      // If there is an error, emit an error event
      if (error) emitter.emit("error", "ERROR", "Problem reading tokens.json.");
      // Parse the data from the tokens.json file
      let tokens = JSON.parse(data);
      // Find the index of the token for the given username
      const tokenIndex = tokens.findIndex(
        (token) => token.username === userName
      );
      // If the token is found, update the phone or email with the new data
      if (tokenIndex !== -1) {
        if (updateType === "p") {
          tokens[tokenIndex].phone = newData;
        } else {
          tokens[tokenIndex].email = newData;
        }
        const updatedTokens = JSON.stringify(tokens, null, 2);

        // Write the updated tokens array to the tokens.json file
        fs.writeFile(
          __dirname + "/tokens/tokens.json",
          updatedTokens,
          (error) => {
            // If there is an error, emit an error event
            if (error) {
              console.error("Problem updating tokens.json.");
            } else {
              // If there is no error, log a message that the phone or email was updated
              if (updateType === "p") {
                // Log a message that the phone number was updated
                console.log(`Phone number updated for ${userName}.`);
                emitter.emit(
                  "event",
                  "UPDATE",
                  `Phone number updated for ${userName}.`
                );
              } else {
                // Log a message that the email was updated
                console.log(`Email updated for ${userName}.`);
                emitter.emit(
                  "event",
                  "UPDATE",
                  `Email updated for ${userName}.`
                );
              }
            }
          }
        );
      } else {
        // If the token is not found, emit an error event
        console.log(`${userName} not found.`);
        emitter.emit("error", "ERROR", `Token for ${userName} not found.`);
      }
    });
  }
};

function searchByUsername(username) {
  fs.readFile(
    path.join(__dirname, "/tokens/tokens.json"),
    "utf-8",
    (error, data) => {
      if (error) {
        emitter.emit("error", "ERROR", "Problem reading tokens.json.");
        return;
      }
      try {
        const tokens = JSON.parse(data);
        const user = tokens.find((token) => token.username === username);
        if (user) {
          console.log(`The token for ${username} is: ${user.token}`);
        } else {
          console.log(`User with username ${username} not found.`);
        }
      } catch (parseError) {
        console.error("Error parsing tokens.json:", parseError);
      }
    }
  );
}

function searchByEmail(email) {
  fs.readFile(
    path.join(__dirname, "/tokens/tokens.json"),
    "utf-8",
    (error, data) => {
      if (error) {
        emitter.emit("error", "ERROR", "Problem reading tokens.json.");
        return;
      }
      try {
        const tokens = JSON.parse(data);
        const user = tokens.find((token) => token.email === email);
        if (user) {
          console.log(`The token for ${user.username} is: ${user.token}`);
        } else {
          console.log(`User with email ${email} not found.`);
        }
      } catch (parseError) {
        emitter.emit("error", "ERROR", "Error parsing tokens.json.");
      }
    }
  );
}

function searchByPhone(phone) {
  fs.readFile(
    path.join(__dirname, "/tokens/tokens.json"),
    "utf-8",
    (error, data) => {
      if (error) {
        emitter.emit("error", "ERROR", "Problem reading tokens.json.");
        return;
      }
      try {
        const tokens = JSON.parse(data);
        const user = tokens.find((token) => token.phone === phone);
        if (user) {
          console.log(`The token for ${user.username} is: ${user.token}`);
        } else {
          console.log(`User with phone number ${phone} not found.`);
        }
      } catch (parseError) {
        emitter.emit("error", "ERROR", "Error parsing tokens.json.");
      }
    }
  );
}

let getCount = () => {
  fs.readFile(__dirname + "/tokens/tokens.json", "utf-8", (error, data) => {
    if (error) {
      emitter.emit("error", "ERROR", "Problem reading tokens.json.");
    } else {
      const tokens = JSON.parse(data);
      console.log(`The count of tokens is: ${tokens.length - 1}`);
    }
  });
};

let tokens = () => {
  // Check if the tokens.json file exists
  if (!fs.existsSync(path.join(__dirname, "./tokens/tokens.json"))) {
    console.log('No tokens.json found. Please use "PO init --all"');
  } else {
    // Check the arguments for the token command
    switch (myArgs[1]) {
      case "--help":
        console.log(tokenHelp);
        emitter.emit("event", "HELP", "Token help displayed.");
        break;
      case "--count":
        getCount();
        emitter.emit("event", "EVENT", "Token count displayed.");
        break;
      case "--new":
        // Create a new token for the given username
        tokenNew(myArgs[2]);
        emitter.emit("event", "CREATE", `New token created for ${myArgs[2]}.`);
        break;
      case "--upd":
        // Update the phone number or email for the given username
        switch (myArgs[2]) {
          case "p":
            // Update the phone number for the given username
            tokenUpdate(myArgs[2], myArgs[3], myArgs[4]);
            emitter.emit(
              "event",
              "UPDATE",
              `Phone number updated for ${myArgs[3]}.`
            );
            break;
          case "e":
            // Update the email for the given username
            tokenUpdate(myArgs[2], myArgs[3], myArgs[4]);
            emitter.emit("event", "UPDATE", `Email updated for ${myArgs[3]}.`);
            break;
        }
        break;
      case "--search":
        switch (myArgs[2]) {
          case "u":
            searchByUsername(myArgs[3]);
            emitter.emit("event", "SEARCH", `Token searched for ${myArgs[3]}.`);
            break;
          case "e":
            searchByEmail(myArgs[3]);
            emitter.emit("event", "SEARCH", `Token searched for ${myArgs[3]}.`);
            break;
          case "p":
            searchByPhone(myArgs[3]);
            emitter.emit("event", "SEARCH", `Token searched for ${myArgs[3]}.`);
            break;
        }
        break;
    }
  }
};
module.exports.tokens = tokens;
