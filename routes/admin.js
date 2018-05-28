const operations = require('../mongodb/operations');
const handler = require('../mongodb/handler');
const router = require('express').Router();
const testHandling = require('../data/mongo_data');

/* POST */
router.post('/admin/database', function(req, res) {
    req.query = handler.getRealRequest(req.query, req.body);
    
    if (req.query.action && req.query.objects) {
    	switch(req.query.action) {
    	  case "insert":
    	    testHandling.insertData(req.query.objects, function() {
        		res.status(200).jsonp({
            		    "status" : "insert done"
            	});
    	    });  		  
    	  break;
    	  case "delete":
      	    testHandling.deleteData(req.query.objects, function() {
        		res.status(200).jsonp({
            		    "status" : "delete done"
            	});
      	    })
    	  break;
    	  default:
    	    res.status(422).jsonp({
    	      "status" : "unrecognized action"
    	    });
    	  break;
    	}
    } else {
	    res.status(422).jsonp({
  	      "status" : "action failed"
  	    });
    }
});

module.exports = router;