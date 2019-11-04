const querystring = require("querystring");
const http = require("http");
const url = require("url");
const fs = require("fs");
const express = require("express")
const app = express();
const Client = require('bitcoin-core');
const client = new Client({ 
  network: 'regtest', 
  username: 'bitcoin', 
  password: 'bitcoin', 
  port: 18443 
});

//Test Server 1
let server = http.createServer((request, response) => {
    urlObject = url.parse(request.url);
  console.log(urlObject.pathname)
    if (urlObject.pathname === "/getBlock") {
      //let blockHash = '6d41a036ee6dac9f4a4484db9b318e61d684ecbfbeaca4960f173b2e6450a920'
      console.log(urlObject.search)
      let blockHash = querystring.parse(urlObject.search.slice(1)).hash;
      console.log(blockHash)
      
      //client.getBlockchainInfo().then((help) => console.log(help));
      let blockInfos = client.getBlockByHash(blockHash, { extension: 'json' })
      
      blockInfos.then(function(arg){
        response.write(JSON.stringify(arg));
        console.log(arg)
        response.end();
      })
    } else {
      urlObject = url.parse(request.url);

      let relPath = `.${urlObject.pathname}`;
  
      if (fs.existsSync(relPath) && fs.statSync(relPath).isFile())
          response.write(fs.readFileSync(relPath, "utf-8"));
      else
          response.write("server listening on port 3000...");
    response.end();
    }

});

server.listen(3000);