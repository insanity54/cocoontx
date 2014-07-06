var qr = require('qr-image');
var fs = require('fs');


/*
 * createQR
 *
 * Creates a PNG QR code using the passed data
 * calls back with file path of new QR code
 *
 * @param {String} data     data to be encoded into QR code
 * @callback callback       ({bool} err, {String} path)
 */
var create = function(data, callback) {
    console.log('qr::create');

    id = Math.random().toString(36).substring(7);
    console.log('id: ' + id);
    
    var qrPNG = qr.image(data, { type: 'png' });
    console.log('qr::create CREAED');

    callback(null, qrPNG); // qrPNG is a readable stream

}

module.exports = {
    create: create
}
