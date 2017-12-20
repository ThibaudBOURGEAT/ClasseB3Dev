var http = require('http');
var fs = require('fs');
var qs = require('querystring');

const port = 1313;
const host = '0.0.0.0';

const router = (req, res) => {
  if (req.url === '/login' && req.method === 'POST') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(req.body));
  }
  else if (req.url === '/login' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync('templates/login.html'));
  }
  else if (req.url === '/url1' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end("Première URL");
  }
  else if (req.url === '/url2' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end("Deuxième URL");
  }
  else if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('Le serveur répond !');
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('Erreur 404 - Vous êtes perdu !');
  }
}

const requestHandler = (req, res) => {
  let body = '';
  req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
          req.connection.destroy();
  });
  req.on('end', function () {
      var post = qs.parse(body);
      req.body = post;
      // use post['blah'], etc.
      router(req, res);
  });
}

const server = http.createServer(requestHandler);

server.listen(port, host, () => {
  console.log('Server listening on ' + host + ':' + port);
});
