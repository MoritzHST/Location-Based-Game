const logging = require('./logging');
const ObjectID = require('mongodb').ObjectID;
const validator = require('../validation/user').filter;

module.exports = {
    idFriendlyQuery: function (pQuery) {
        var testQuery = pQuery;
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
    checkIfValidQuery: function (pQuery) {
        return !pQuery.hasOwnProperty(undefined) && Object.keys(pQuery).length > 0;
    },
    jsonParse: function (pProperty, pValue) {
        return JSON.parse('{ "' + pProperty + '": "' + pValue + '" }');
    },
    dbResult: function (pErr, pRes, pResult, pResultType) {
        if (pErr) {
            logging.Error(pErr);
            pRes.status(422).jsonp({
                "error": "Es ist ein Fehler aufgetreten beim Versuch sich mit der Datenbank zu verbinden!"
            });
        } else {
            if (!pResult)
                pRes.status(422).jsonp({
                    "error": pResultType
                });
            else
                pRes.status(200).jsonp(pResult);
        }
    },
    checkUsernameValidity: function (pUsername, pOnInvalidName) {
        if (!validator.matchesRegex(pUsername)) {
            pOnInvalidName({
                "error": "Der Nutzername muss zwischen 3 und 20 Zeichen lang sein und darf nur Buchstaben enthalten."
            });
        }
        if (!validator.isKind(pUsername)) {
            pOnInvalidName({
                "error": "Der Nutzername enthält unzulässige Begrifflichkeiten."
            });
        }
    }
};