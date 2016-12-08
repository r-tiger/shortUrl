const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const shortenUrl = require('./bin/shortenUrl');

const routes = require('./routes/index');

const app = express();

// Connect to our mongo database
const uri = process.env.MONGOLAB_URI || 'mongodb://localhost/shortenUrl';
mongoose.connect(uri);
console.log('Connecting to DB : ', uri);

const UrlBase = require('./models/model');

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
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error  : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error  : {}
    });
});

//*****************API****************************
const router = express.Router();
/*router.use(function(req, res, next) {
 // do logging
 next();
 });*/
router.route('/save')
    .post(function(req, res) {
        const Url = req.body.url;
        const sendRes = res;
        let shortUrl = '';
        UrlBase.findOne({url: Url}, function(err, doc) {
            if (doc) {
                shortUrl = shortenUrl.encodeUrl(doc.count);
                res.send({'shortUrl': shortUrl});
            }
            else {
                UrlBase.findOne({})
                    .sort('-count')  // give me the max
                    .exec(function(err, obj) {
                        let maxCount;
                        if (obj && obj.count) {
                            maxCount = obj.count + 1;
                        }
                        else {
                            maxCount = 1000;
                        }
                        const newUrl = UrlBase({
                            url     : Url,
                            date    : new Date(),
                            count   : maxCount,
                            shortUrl: shortenUrl.encodeUrl(maxCount)
                        });
                        // save the new link
                        newUrl.save(function(err, res) {
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
