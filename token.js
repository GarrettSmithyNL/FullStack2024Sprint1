const myArgs = process.argv.slice(2);
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const emitter = require("./emitter.js");

let tokenNew = (newUsername) => {
  let newToken = JSON.parse(`{
      "created": "1969-01-31 12:30:00",
      "username": "username",
      "email": "user@example.com",
      "phone": "5556597890",
      "token": "token",
      "expires": "1969-02-03 12:30:00",
      "confirmed": "tbd"
  }`);

  newToken.created = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  newToken.username = newUsername;

  // Place token generation

  fs.readFile(__dirname + "/tokens/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    updatedTokens = JSON.stringify(tokens);

    fs.writeFile(__dirname + "/tokens/tokens.json", updatedTokens, (err) => {
      if (err) emitter.emit("error", "ERROR", "Problem appending tokens.json.");
      else {
        console.log(`New token was created for ${newToken.username}.`);
      }
    });
  });
};

let tokenUpdate = (updateType, userName, newData) => {
  if (updateType !== "p" && updateType !== "e") {
    console.log(`Not a valid argument. Please use 'PO token --help'`);
  } else {
    fs.readFile(__dirname + "/tokens/tokens.json", "utf-8", (error, data) => {
      if (error) emitter.emit("error", "ERROR", "Problem reading tokens.json.");
      let tokens = JSON.parse(data);
      const tokenIndex = tokens.findIndex(
        (token) => token.username === userName
      );
      if (tokenIndex !== -1) {
        if (updateType === "p") {
          tokens[tokenIndex].phone = newData;
        } else {
          tokens[tokenIndex].email = newData;
        }
        const updatedTokens = JSON.stringify(tokens, null, 2);

        fs.writeFile(
          __dirname + "/tokens/tokens.json",
          updatedTokens,
          (error) => {
            if (error) {
              console.error("Problem updating tokens.json.");
            } else {
              if (updateType === "p") {
                console.log(`Phone number updated for ${userName}.`);
                emitter.emit(
                  "event",
                  "UPDATE",
                  `Phone number updated for ${userName}.`
                );
              } else {
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
        console.log(`${userName} not found.`);
        emitter.emit("error", "ERROR", `Token for ${userName} not found.`);
      }
    });
  }
};

let tokens = () => {
  if (!fs.existsSync(path.join(__dirname, "./tokens/tokens.json"))) {
    console.log('No tokens.json found. Please use "PO init --all"');
  } else {
    switch (myArgs[1]) {
      case "--help":
        break;
      case "--count":
        break;
      case "--new":
        tokenNew(myArgs[2]);
        break;
      case "--upd":
        switch (myArgs[2]) {
          case "p":
            tokenUpdate(myArgs[2], myArgs[3], myArgs[4]);
            break;
          case "e":
            tokenUpdate(myArgs[2], myArgs[3], myArgs[4]);
            break;
        }
        break;
      case "--search":
        switch (myArgs[2]) {
          case "u":
            break;
          case "e":
            break;
          case "p":
            break;
        }
        break;
    }
  }
};

module.exports.tokens = tokens;
