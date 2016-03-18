if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}


var http      = require('http');
var httpProxy = require('http-proxy');
var url       = require('url');

var target   = process.env.TARGET || 'https://sendgrid.net';
var port     = process.env.PORT || 8080;
var siteFile = require('./apple-app-site-association.json');

var proxy  = httpProxy.createProxyServer(
  {target: target, toProxy: true, xfwd: true, secure: false});
var server = http.createServer(onRequest).listen(port);

proxy.on('error', onProxyError);

function onRequest(req, res) {
  path = url.parse(req.url).path;

  if(path == '/apple-app-site-association') {
    respondWithJSON(res, siteFile);
  } else {
    console.log('Proxying request to ', path);
    proxy.web(req, res);
  }
}

function onProxyError(error, req, res) {
  errorMessage = 'Error during proxy: ' + error;
  console.error(errorMessage);
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end(errorMessage);
}

function respondWithJSON(res, value) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(value));
  res.end();
}

console.log('Proxying requests on port ' + port + ' to ' + target);
