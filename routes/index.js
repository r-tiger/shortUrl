var express = require('express');
var router = express.Router();
var shortenUrl = require('../bin/shortenUrl');
var UrlBase = require('../models/model');
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'shortUrl site'});

});

router.get("/api/get", function (req, res, next) {
    UrlBase.find({}, function (err, doc) {
        res.send(doc);
    });
});

router.get('/:id', function (req, res) {
    var id = req.params.id;
    var count = shortenUrl.decodeUrl(id);
    UrlBase.findOne({count: count}, function (err, doc) {
        if (doc) {
            res.redirect(doc.url);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
