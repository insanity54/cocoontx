=======
CocoonTX
========

Helps you get cocoonjs projects from your compy to your phone.

it works like this:

- Your cocoonjs projects are put in a single directory
- you tell cocoontx the cocoonjs app directory (the one containing all your cocoonjs projects)
- cocoontx scans the app directory and creates an index with download links and QR codes
- you visit the index on your compy
- in the cocoonjs launcher app on your phone, scan the qr code on the cocoontx index
- cocoontx serves a zip of the selected app to the cocoonjs launcher
- cocoonjs launcher now has the app



Install
-------

- `$ npm install`
- create a file config.json in the app root containing similar (tweak it for your machine):
```
{
    "APPDIR": "/home/chris/scripts/cocoonjs-apps",
    "PORT": 28349    
}
```
- `$ npm start`