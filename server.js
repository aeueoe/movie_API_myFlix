const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;

  let filePath = "";
  if (pathname.includes("documentation")) {
    filePath = __dirname + "/documentation.html";
  } else {
    filePath = __dirname + "/index.html";
  }

  fs.appendFile(
    "log.txt",
    `URL: ${request.url}\nTimestamp: ${new Date()}\n\n`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Added to log.");
      }
    }
  );
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      response.writeHead(404, { "Content-Type": "text/html" });
      response.end("404 Not Found");
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    }
  });
});

server.listen(8080);
console.log("My test server is running on Port 8080.");
