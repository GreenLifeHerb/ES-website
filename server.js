const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const rootDir = __dirname;
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function resolvePath(urlPath) {
  const cleanedPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = cleanedPath === "/" ? "/index.html" : cleanedPath;
  const normalized = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  return path.join(rootDir, normalized);
}

function sendFile(request, response, filePath, statusCode = 200) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || "application/octet-stream";

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal server error");
      return;
    }

    const acceptsGzip = /\bgzip\b/.test(request.headers["accept-encoding"] || "");
    const shouldCompress =
      acceptsGzip && [".html", ".css", ".js", ".json", ".svg", ".txt"].includes(extension);
    const body = shouldCompress ? zlib.gzipSync(data) : data;
    const headers = {
      "Content-Type": contentType,
      "Cache-Control":
        extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    };

    if (shouldCompress) {
      headers["Content-Encoding"] = "gzip";
      headers.Vary = "Accept-Encoding";
    }

    response.writeHead(statusCode, headers);
    response.end(body);
  });
}

const server = http.createServer((request, response) => {
  const filePath = resolvePath(request.url || "/");

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(request, response, filePath);
      return;
    }

    if (!error && stats.isDirectory()) {
      const indexFile = path.join(filePath, "index.html");
      fs.stat(indexFile, (indexError, indexStats) => {
        if (!indexError && indexStats.isFile()) {
          sendFile(request, response, indexFile);
          return;
        }

        sendFile(request, response, path.join(rootDir, "404.html"), 404);
      });
      return;
    }

    sendFile(request, response, path.join(rootDir, "404.html"), 404);
  });
});

server.listen(port, () => {
  console.log(`Essence Source static site running at http://localhost:${port}`);
});
