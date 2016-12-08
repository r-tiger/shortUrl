const mongoose = require('mongoose');

// Create a new schema for our UrlBase data
const schema = new mongoose.Schema({
    id      : String,
    date    : Date,
    url     : String,
    shortUrl: String,
    count   : Number
});

// Return a Url model based upon the defined schema
module.exports = mongoose.model('UrlBase', schema);