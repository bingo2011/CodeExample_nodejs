var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js': 'text/javascript',
	'.html': 'text/html',
	'.css': 'text/css'
};

var cache = {};

http.createServer(function (request, response) {
	var lookup = path.basename(decodeURI(request.url)) || 'index.html',
		f = 'content/' + lookup;
	fs.exists(f, function(exists) {
		if (exists) {
			var s = fs.createReadStream(f).once('open', function() {
				var headers = {'Content-type': mimeTypes[path.extname(lookup)]};
				response.writeHead(200, headers);
				this.pipe(response);
			}).once('error', function(e) {
				console.log(e);
				response.writeHead(500);
				response.end('Server Error!');
			})

			fs.stat(f, function(err, stats) {
				var bufferOffset = 0;
				cache[f] = {content: new Buffer(stats.size)};

				s.on('data', function(chunk) {
					chunk.copy(cache[f].content, bufferOffset);
					bufferOffset += chunk.length;
				});
			});
			return;
		}
		response.writeHead(404);
		response.end('Page Not Found');
		console.log(exists ? lookup + " is there" : lookup + " doesn't exist");
	});
}).listen(8080);
