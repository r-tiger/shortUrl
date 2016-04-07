var mongoose = require('mongoose');

// Create a new schema for our UrlBase data
var schema = new mongoose.Schema({
    id: String,
    date: Date,
    url: String,
    shortUrl: String,
    count: Number
});



// Return a Url model based upon the defined schema
module.exports = UrlBase = mongoose.model('UrlBase', schema);