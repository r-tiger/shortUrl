var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var shortenUrl = require('./bin/shortenUrl');

var routes = require('./routes/index');

var app = express();

// Connect to our mongo database
var uri = process.env.MONGOLAB_URI || 'mongodb://localhost/shortenUrl';
mongoose.connect(uri);
console.log('Connecting to DB : ', uri);

var UrlBase = require('./models/model');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//*****************API****************************
var router = express.Router();
/*router.use(function(req, res, next) {
 // do logging
 next();
 });*/
router.route('/save')
    .post(function (req, res) {
        var Url = req.body.url;
        var sendRes = res;
        var shortUrl = "";      
        UrlBase.findOne({url: Url}, function (err, doc) {
            if (doc) {
                shortUrl = shortenUrl.encodeUrl(doc.count);
                res.send({'shortUrl': shortUrl});
            }
            else {
                UrlBase.findOne({})
                    .sort('-count')  // give me the max
                    .exec(function (err, obj) {
                        var maxCount;
                        if (obj && obj.count) {
                            maxCount = obj.count+1;
                        } else {
                            maxCount = 1000;
                        }
                        var newUrl = UrlBase({
                            url: Url,
                            date: new Date(),
                            count: maxCount,
                            shortUrl: shortenUrl.encodeUrl(maxCount)
                        });
                        // save the new link
                        newUrl.save(function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                            sendRes.send(res);
                        });
                    });
            }
        });

    });
// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

module.exports = app;
