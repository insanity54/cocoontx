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


nconf.env(['APPDIR', 'PORT'])
     .file({ file: 'config.json' });

nconf.defaults({
    'PORT': '29833'
});

console.log('>>> app dir is: ' + nconf.get('APPDIR'));
app.set('appDir', nconf.get('APPDIR'));
app.set('port', nconf.get('PORT'));

app.use(express.static(app.get('appDir'))); // serve the cocoonjs project files
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
    fs.readdir(app.get('appDir'), function(err, files) {

	
	res.render('index.html', {
	    projects: files,
	    server: srv
	});
    });
}



	

// when GET download link
// zip app directory
// serve zipped project
app.get('/project/:proj', function(req, res) {
    var proj = req.params.proj;
    var appDir = app.get('appDir');

    // remove file extension if there is one

    proj = proj.substr(0, proj.lastIndexOf('.'));
    
    console.log('serving project ' + proj);

    // get files in project directory
    fs.readdir(appDir + '/' + proj,
	       function(err, files) {
		   if (err) return res.send(500, 'error of some sort: ' + err);
		   if (files.length == 0) {
		       console.log('no files');
		       console.log('error code 204 is: ' + http.STATUS_CODES[204]);
		       res.send('error 204. No files in project.');
		   }
		   
		   console.log('files object type: ' + typeof(files));
		   console.log('files in project: ' + files);
		   console.dir(files);
		   
		   var totalFiles = files.length;
		   var zippedFiles = 0;
		   var z = new JSZip();
		   

		   console.log('files in proj: ' + files);
		   console.log('total files: ' + totalFiles);


//		   if (totalFiles == 0) {
//		       console.log('this proj has no files, it has ' + totalFiles + '<');
//		       return res.send(204, 'This project contains no files');
//		       //res.send(204);
//		   }
		   
		   // for each file
		   //   fs read file (takes time)
		   //     z.file (takes time)
		   //       zippedFiles ++
		   //
		   // endfor
		   //
		   // if zippedFiles == totalFiles
		   //   write zip file to res
		   //
		   
		   
		   // for (i = 0; i < totalFiles; i++) {
		   //     console.log(' adding file: ' + app.get('appDir') + '/' + files[i]);
		   //     z.file(app.get('appDir') + '/' + files[i]);

		       
		       
		   // }

		   
		   
		   
		   files.forEach(function(f, index, arr) {
		       console.log('adding file: ' + appDir + '/' + proj + '/' + f);
		       fs.readFile(appDir + '/' + proj + '/' + f,
				   function(err, data) {
				       if (err) console.log('couldnt read file ' + f + ': ' + err); // return res.send(500, 'couldn\'t read file ' + f + ' in project');
				       // file is read, add to zip
				       z.file(f, data);

				       // count that we've added the file
				       zippedFiles ++;

				       if (zippedFiles == totalFiles) {
					   console.log('>>>> ZIP GEN COMPLETE <<<<');
					   var buffer = z.generate({ type:"nodebuffer" });
					   res.writeHead(200, {"Content-Type": "application/zip" });
					   res.write(buffer);
					   res.end();
					   
				       }
				       
				   });
		   });
	       });    
});





server.listen(app.get('port'));
console.log('server listening on port ' + app.get('port'));
