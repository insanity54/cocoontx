var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var fs = require('fs');
var nconf = require('nconf');
var nunjucks = require('nunjucks');


nconf.env(['APPDIR', 'PORT'])
     .file({ file: 'config.json' });

nconf.defaults({
    'PORT': '29833'
});

console.log('>>> app dir is: ' + nconf.get('APPDIR'));
app.set('appDir', nconf.get('APPDIR'));

app.use(express.static(app.get('appDir')));

nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader(__dirname + '/tpl'), {
    autoescape: true });
nunjucksEnv.express(app);



// get list of all files in appDir
// for each file in appDir
// create directory with download link & QR code
app.get('/', function(req, res) {
    fs.readdir(app.get('appDir'), function(err, files) {
	
	console.log('files found: ' + files);
	console.log('type: ' + typeof(files));
	console.dir(files);

	res.render('index.html', {
	    projects: files
	});
    });
});


// when GET download link
// zip app directory
// serve zip




server.listen(nconf.get('PORT'));
console.log('server listening on port ' + nconf.get('PORT'));
