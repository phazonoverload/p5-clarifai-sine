All runs on the client. Here's how to get it set up: 

## Get your Clarifai credentials

To get started, create an account at [developer.clarifai.com](http://developer.clarifai.com).

Create an application, and get your Client ID and Client Secret.

This basic starter uses your Client ID and Client Secret to get an access token. Since this expires every so often, the client is setup to renew the token for you automatically using your credentials so you don't have to worry about it.

## Set up the web app

To get this applicationapplication running, you'll need a keys.js file. This has been added to the .gitignore for security purposes, so you don't share your Client ID and Client Secret with others. Rename keys.example.js to keys.js and have it look like the following:

```
var CLIENT_ID = 'your ID here';
var CLIENT_SECRET = 'your secret here';
```

The web app is pretty much good to go. It's all client-side, so will run on any web server. You may want to consider implementing a more secure way to store your keys if you are using this in production. For the sake of this quick project, this is suitable.
