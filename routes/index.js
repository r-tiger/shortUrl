const express = require('express');
const router = express.Router();
const shortenUrl = require('../bin/shortenUrl');
const UrlBase = require('../models/model');
const bodyParser = require('body-parser');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title: 'shortUrl site'});

});

router.get('/api/get', (req, res, next) => {
    UrlBase.find({}, (err, doc) => {
        res.send(doc);
    });
});

router.get('/:id', (req, res) => {
    const id    = req.params.id;
    const count = shortenUrl.decodeUrl(id);
    UrlBase.findOne({count: count}, (err, doc) => {
        if (doc) {
            res.redirect(doc.url);
        }
        else {
            res.redirect('/');
        }
    });
});

module.exports = router;
