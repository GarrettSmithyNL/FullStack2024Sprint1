const http = require("http");
const path = require("path");
const emitter = require("./emitter.js");
const fs = require("fs");
const queryString = require("querystring");

const port = 3000;

const redirect = (path, response) => {
  response.statusCode = 302;
  response.setHeader("location", path);
  response.end();
};

const readFile = (path, response) => {
  fs.readFile(path, "utf8", (error, data) => {
    if (error) {
      response.statusCode = 500;
      emitter.emit("error", "ERROR", `"${path}" was not found`);
    } else {
      response.setHeader("Content-Type", "text/html");
      response.write(data);
      response.end();
    }
  });
};

let getToken = () => {};

const server = http.createServer((request, response) => {
  // Log the requested URL if the DEBUG variable is set to true
  if (DEBUG) {
    if (request.url == "/favicon.ico") {
    } else {
      console.log("Requested URL: " + request.url);
    }
  }

  if (request.method === "POST") {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      const parsedBody = queryString.parse(body);
      userName = parsedBody.username;
      console.log("User Name: " + userName);
      fs.readFile("./views/tokens.html", "utf8", (err, data) => {
        if (err) {
          response.writeHead(500, { "Content-Type": "text/html" });
          emitter.emit("error", "ERROR", "Error loading the page");
          response.end("<h1>Error loading the page</h1>");
        } else {
          // Modify the HTML content to include the additional section
          const updatedHtml = data.replace(
            "</body>",
            `<div>User Name: ${userName}</div></body>`
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
