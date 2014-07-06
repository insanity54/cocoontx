var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var fs = require('fs');
var nconf = require('nconf');


app.set('appDir', nconf.get('APPDIR'));
app.use(express.static(appDir));



// get list of all files in appDir
// for each file in appDir
// create directory with download link & QR code
fs.readdir(appDir, function(err, files) {

    console.log('files found: ' + files);
    
});


// when GET download link
// zip app directory
// serve zip




server.listen(port);
console.log('server listening on port ' + port);
