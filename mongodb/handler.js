const logging = require('./logging');

module.exports = {
	dbResult: function(err, res, result, resultType) {
		if (err) {
	    	logging.Error(err);
	        res.status(422).jsonp({"error": "Es ist ein Fehler aufgetreten beim Versuch sich mit der Datenbank zu verbinden!"});
	    }
	    else {
	    	if (!result)
	    		res.status(422).jsonp({"error": resultType + " existiert nicht!"});
	    	else
	            res.status(200).jsonp(result);        		
	    }			
	}
}