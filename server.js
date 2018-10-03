var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var {Promise} = require('es6-promise');

// For Storm Path
var stormpath = require('express-stormpath');

var LOCAL_PORT = 3000;

var app = express();
var port = process.env.PORT || LOCAL_PORT;
var db = {};

mongoose.connect('mongodb://heroku_6mn2mnfd:uesubshit2csh14se097pikmq@' +
                 'ds139480.mlab.com:39480/heroku_6mn2mnfd');
db = mongoose.connection;

mongoose.Promise = Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('MONGOOSE is working');
});

app.set('trust proxy');

// Serve static content for the app from 'public' directory
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use(stormpath.init(app, {website: true}));

app.on('stormpath.ready', function () {
    app.listen(port, function (err) {
        if (err) {
            return console.error(err);
        }

        /* eslint no-console: "off", prefer-template: "off" */
        return console.log('listening on port ' + port);
    });
});

// Get them routes
require('./controllers/mainController.js')(app);