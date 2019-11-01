let http = require("http");
let url = require("url");
let fs = require("fs");

let server = http.createServer((request, response) => {
    urlObject = url.parse(request.url);

    let relPath = `.${urlObject.pathname}`;

    if (fs.existsSync(relPath) && fs.statSync(relPath).isFile())
        response.write(fs.readFileSync(relPath, "utf-8"));
    else
        response.write("Hello World");

    response.end();
});

server.listen(3000);