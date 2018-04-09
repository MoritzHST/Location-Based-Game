const logging = require('./logging');

Mongo =  {
    client:require('mongodb').MongoClient,
    url:'mongodb://localhost:27017',
    database:'LocationBasedGame'
};

module.exports = {
	call: function(pCallback, pMessage) {
		Mongo.client.connect(Mongo.url, function (err, db) {
	    	if (db == null) {
	    		logging.Error("[" + pMessage + "]: Die Datenbank ist derzeit nicht erreichbar.");
	    		return;
	    	}
	    		        
	        pCallback(db.db(Mongo.database), db);   
	    })
	}
}
