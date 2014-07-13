var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var fs = require('fs');
var dns = require('dns');
var os = require('os');
var nconf = require('nconf');
var nunjucks = require('nunjucks');
var qr = require('./middleware/qr');
var zip = require('./middleware/zip');


nconf.env(['APPSDIR', 'PORT'])
     .file({ file: 'config.json' });

nconf.defaults({
    'PORT': '29833'
});

console.log('>>> apps dir is: ' + nconf.get('APPSDIR'));
app.set('appsDir', nconf.get('APPSDIR'));
app.set('port', nconf.get('PORT'));

app.use(express.static(app.get('appsDir'))); // serve the cocoonjs project files
app.use(express.static(__dirname + '/public/fonts')); // serve the css, fonts, js
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/js'));

nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader(__dirname + '/public/tpl'), {
    autoescape: true });
nunjucksEnv.express(app);












// server info object
var srv = {};


// get list of all files in appDir
// for each file in appDir
// create directory with download link & QR code
app.get('/', generate);


// function(req, res) {

	
// 	console.log('files found: ' + files);
// 	console.log('type: ' + typeof(files));
// 	console.dir(files);

// 	generate();
	
// 	res.render('index.html', {
// 	    projects: files
// 	});
//     });
// });


// get a QR code relating to the user's coconutjs project
app.get('/img/:proj', function(req, res) {

    console.log('got ' + req.params.proj);
    qr.create('http://' + srv.address + ':' + app.get('port') + '/project/' + req.params.proj + '.zip',
	      function(err, png) {
		  res.writeHead(200, {"Content-Type": "image/png" });
		  png.pipe(res);
	      });
});






/*
 * generate
 *
 * generate the page
 *   - LAN accessible url to the download
 *   - qr code
 */
function generate(req, res) {

    // get the lan accessible ip address of this server
    var ifs = os.networkInterfaces();
    console.log('ifs: ' + ifs);
    console.dir(ifs);

    var addresses = [];
    for (k in ifs) {
	for (k2 in ifs[k]) {
            var address = ifs[k][k2];
            if (address.family == 'IPv4' && !address.internal) {
		addresses.push(address.address)
            }
	}
    }
    console.log(addresses)
    
    if (addresses.length > 1) {
	console.log('more than 1 address');
    }

    // got server ip address
    srv.address = addresses[0];

    // get apps
    fs.readdir(app.get('appsDir'), function(err, files) {

	
	res.render('index.html', {
	    projects: files,
	    server: srv
	});
    });
}

/**
 * walk
 *
 * Walk a directory and get an array of all the files & dirs
 * Thanks to http://stackoverflow.com/a/5827895
 *
 * @param {string} dir    an absolute path to the dir to walk
 * @callback done         (err, {Array} results) 
 */
var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
	if (err) return done(err);
	var pending = list.length;
	if (!pending) return done(null, results);
	list.forEach(function(file) {
	    file = dir + '/' + file;
	    fs.stat(file, function(err, stat) {
		if (stat && stat.isDirectory()) {
		    walk(file, function(err, res) {
			results = results.concat(res);
			if (!--pending) done(null, results);
		    });
		} else {
		    results.push(file);
		    if (!--pending) done(null, results);
		}
	    });
	});
    });
};

	

// when GET download link
// zip app directory
// serve zipped project
app.get('/project/:proj', function(req, res) {

    var proj = req.params.proj;
    var proj = proj.substr(0, proj.lastIndexOf('.'));
    var appsDir = app.get('appsDir');
    var appDir = appsDir + '/' + proj;
    
    

    walk(appDir, function(err, results) {
	if (err) throw err;

	console.dir(results);

	var totalFiles = results.length;
	var zippedFiles = 0;
        var z = new JSZip();
	
	results.forEach(function(f) {
	    console.log('iterating thru file ' + f);
	    
	    fs.readFile(f, function(err, data) {
		if (err) throw err;
		console.log('doing this: ' + f.substring(appDir.length, f.length));
		z.file(f.substring(appDir.length, f.length), data);
		zippedFiles ++;

		if (zippedFiles >= totalFiles) {
                    console.log('>>>> ZIP GEN COMPLETE <<<<');
                    var buffer = z.generate({ type:"nodebuffer" });
                    res.writeHead(200, {"Content-Type": "application/zip" });
                    res.write(buffer, 'utf8');
                    res.end();
                }
	    });
	});
    });
});





server.listen(app.get('port'));
console.log('server listening on port ' + app.get('port'));
