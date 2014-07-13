=======
CocoonTX
========

Helps you get cocoonjs projects from your compy to your phone.

it works like this:

- Your cocoonjs projects are put in a single directory (Ex: /home/chris/cocoonjs-apps)
- you tell cocoontx the cocoonjs apps directory (the one containing all your cocoonjs projects)
- cocoontx walks the app directory and creates an index with download links and QR codes
- you visit the index on your compy
- in the cocoonjs launcher app on your phone, scan the qr code on the cocoontx index
- cocoontx serves a zip of the selected app to the cocoonjs launcher
- cocoonjs launcher now has the app and you can now run the app in cocoonjs launcher



Install
-------

- `$ npm install`
- create a directory somewhere which will contain all your cocoonjs apps (Ex: /home/chris/cocoonjs-apps)
- create a file config.json in the app root containing similar (tweak it for your machine):
```
{
    "APPSDIR": "/home/chris/cocoonjs-apps",
    "PORT": 28349    
}
```
- `$ npm start`
- Open your web browser to http://<YOUR NETWORK ADDRESS HERE>:28349