const logging = require('./logging'); 
const ObjectID = require('mongodb').ObjectID;

module.exports = {
	idFriendlyQuery: function(query) {
		var testQuery = query;
		
		if (!testQuery)
			return testQuery;
		
		if (testQuery instanceof Array) {
			for (var i = 0; testQuery.length > i; i += 1) {		
				if (testQuery[i].hasOwnProperty('_id')) {
					testQuery[i]["_id"] = new ObjectID(testQuery[i]["_id"]);
				}		
			}
		} else {
			if (testQuery.hasOwnProperty('_id')) {
				testQuery["_id"] = new ObjectID(testQuery["_id"]);
			}		
		}
		
		return testQuery;
	},
	checkIfValidQuery: function(query) {
		return (!query.hasOwnProperty(undefined) && Object.keys(query).length > 0);
	},
	JSONparse: function(property, value) {
		return JSON.parse('{ "' + property + '": "' + value + '" }');
	},
	dbResult: function(err, res, result, resultType) {
		if (err) {
	    	logging.Error(err);
	        res.status(422).jsonp({"error": "Es ist ein Fehler aufgetreten beim Versuch sich mit der Datenbank zu verbinden!"});
	    }
	    else {
	    	if (!result)
	    		res.status(422).jsonp({"error": resultType });
	    	else
	            res.status(200).jsonp(result);  		
	    }			
	}
}