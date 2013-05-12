var http = require('http');
http.createServer(function (request, response) {
	response.writeHeader(200, {'Content-Type': 'text/html'});
	response.end('Woohoo123!');
}).listen(8080);
