const http = require("http");
const emitter = require("./emitter.js");
const fs = require("fs");
const queryString = require("querystring");

const port = 3000;

const redirect = (path, response) => {
  // Redirect the user to the given path
  response.statusCode = 302;
  response.setHeader("location", path);
  response.end();
};

const readFile = (path, response) => {
  fs.readFile(path, "utf8", (error, data) => {
    if (error) {
      // If there is an error, send a 500 status code and an error message
      response.statusCode = 500;
      emitter.emit("error", "ERROR", `"${path}" was not found`);
    } else {
      // If there is no error, send the data back in the response
      response.setHeader("Content-Type", "text/html");
      response.write(data);
      response.end();
    }
  });
};

let getToken = (username) => {
  // Read the tokens.json file
  let data = fs.readFileSync("./tokens/tokens.json");
  try {
    // Parse the data from the tokens.json file
    let tokens = JSON.parse(data);
    // Find the token for the given username
    let user = tokens.find((token) => token.username === username);
    if (user) {
      // If the token is found, return the token of the user
      emitter.emit("event", "EVENT", `Token for ${username} found.`);
      return user.token;
    } else {
      // If the token is not found, emit an error event and return a message
      emitter.emit("error", "ERROR", `Token for ${username} not found.`);
      return "User not found";
    }
  } catch (parseError) {
    // If there is an error parsing the tokens.json file, emit an error event
    emitter.emit("error", "ERROR", `Error parsing tokens.json: ${parseError}`);
  }
};

const server = http.createServer((request, response) => {
  // Log the requested URL if the DEBUG variable is set to true
  if (DEBUG) {
    if (request.url == "/favicon.ico") {
    } else {
      console.log("Request received for: " + request.url);
    }
  }

  if (request.method === "POST" && request.url === "/tokens") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      // Parse the body of the request
      const parsedBody = queryString.parse(body);
       // Get the username from the parsed body
      userName = parsedBody.username;
      // Read the tokens.html file
      fs.readFile("./views/tokens.html", "utf8", (err, data) => {
        if (err) {
           // If there is an error, send a 500 status code and an error message
          response.writeHead(500, { "Content-Type": "text/html" });
          emitter.emit("error", "ERROR", "Error loading the page");
          response.end("<h1>Error loading the page</h1>");
        } else {
          // If there is no error, modify the HTML to include the username and token
          const updatedHtml = data.replace(
            "</body>",
            ` <div>
                <h3>User Name: ${userName}</h3>
                <h3>Token: ${getToken(userName)}</h3>
              </div>
            </body>`
          );

          // Send the modified HTML back in the response
          response.end(updatedHtml);
        }
      });
    });
  } else {
    // Set the status code to 200
    response.statusCode = 200;
    // Set the content type to text/html
    response.setHeader("Content-Type", "text/html");
    switch (request.url) {
      // Check the requested URL and send the corresponding file
      case "/":
      case "/home":
        readFile("./views/index.html", response);
        break;
      case "/tokens":
        readFile("./views/tokens.html", response);
        break;
      case "/favicon.ico":
        // If the requested URL is for the favicon, do nothing
        break;
      default:
        // Redirect the user to the home page if the requested URL is unknown
        redirect("/", response);
        // Emit an error event when the user enters an unknown path
        emitter.emit("error", "ERROR", "User entered a unknown path");
        break;
    }
  }
});

// Start the server
server.listen(port, () => {
  console.log("Server running!");
});

