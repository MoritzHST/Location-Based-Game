var MongoWrapper = function () {
    this.client = require('mongodb').MongoClient;
    this.url = 'mongodb://localhost:27017';
    this.database = 'LocationBasedGame';
};

module.exports = new MongoWrapper();