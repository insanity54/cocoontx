var z = require('node-zip')();


function zip() {

    z.file('test.file', 'hai thurr');
    var data = z.generate({base64:false, compression:'DEFLATE'});
    console.log(data);
}


    
module.exports = {
    zip: zip
};
