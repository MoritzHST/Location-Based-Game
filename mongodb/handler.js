const logging = require('../helper/logging');
const ObjectID = require('mongodb').ObjectID;
const validator = require('../validation/user').filter;

function userValidityWrapper(pIsValid, pErr) {
    logging.Entering("userValidityWrapper");
    logging.Parameter("pIsValid", pIsValid);
    logging.Parameter("pErr", pErr);

    this.isValid = pIsValid;
    this.err = pErr;

    logging.Leaving("userValidityWrapper");
}

function convertIdFields(pObject, pField) {
    if (pObject[pField]) {
        pObject[pField] = new ObjectID(pObject[pField]);
    }
    for (let i in pObject) {
        if (pObject.hasOwnProperty(i) && typeof pObject[i] === "object") {
            pObject[i] = convertIdFields(pObject[i], pField);
        }
    }
    return pObject;
}

module.exports = {
    idFriendlyQuery: function (pQuery) {
        logging.Entering("isFriendlyQuery");
        logging.Parameter("pQuery", pQuery);

        var testQuery = pQuery;
        if (!testQuery) {
            logging.Leaving("idFriendlyQuery (null)");
            return testQuery;
        }
        if (testQuery instanceof Array) {
            for (var i = 0; testQuery.length > i; i += 1) {
                if (testQuery[i].hasOwnProperty('_id') && testQuery[i]["_id"].constructor === {}.constructor) {
                    continue;
                } else if (testQuery[i].hasOwnProperty('_id')) {
                    testQuery[i]["_id"] = new ObjectID(testQuery[i]["_id"]);
                }
            }
        } else {
            if (testQuery.hasOwnProperty('_id') && testQuery["_id"].constructor === {}.constructor) {
                logging.Leaving("idFriendlyQuery (JSON / Single)");
                return testQuery;
            } else if (testQuery.hasOwnProperty('_id')) {
                testQuery["_id"] = new ObjectID(testQuery["_id"]);
            }
        }
        logging.Leaving("idFriendlyQuery (ID)");
        return testQuery;
    }, getRealRequest: function (pQuery, pBody) {
        logging.Entering("getRealRequest");
        logging.Parameter("pQuery", pQuery);
        logging.Parameter("pBody", pBody);

        var bodyParse = JSON.parse(JSON.stringify(pBody));

        logging.Leaving("getRealRequest");

        return Object.keys(bodyParse).length > 0 ? logging.ReturnValue(bodyParse) : logging.ReturnValue(pQuery);
    }, checkIfValidQuery: function (pQuery) {
        logging.Entering("checkIfValidQuery");
        logging.Parameter("pQuery", pQuery);
        logging.Leaving("checkIfValidQuery");
        return logging.ReturnValue(!pQuery.hasOwnProperty(undefined) && Object.keys(pQuery).length > 0);
    }, jsonParse: function (pProperty, pValue) {
        logging.Entering("jsonParse");
        logging.Parameter("pProperty", pProperty);
        logging.Parameter("pValue", pValue);
        logging.Leaving("jsonParse");
        return logging.ReturnValue(JSON.parse('{ "' + pProperty + '": "' + pValue + '" }'));
    }, dbResult: function (pErr, pRes, pResult, pResultType) {
        logging.Entering("dbResult");
        logging.Parameter("pErr", pErr);
        logging.Parameter("pResult", pResult);
        logging.Parameter("pResultType", pResultType);

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

        logging.Leaving("dbResult");
    }, getUsernameValidity: function (pUsername) {
        logging.Entering("getUsernameValidity");
        logging.Parameter("pUsername", pUsername);

        if (!validator.matchesRegex(pUsername)) {
            return new userValidityWrapper(false, {
                "error": "Der Nutzername muss zwischen 3 und 20 Zeichen lang sein und darf nur Buchstaben enthalten."
            });
        }
        if (!validator.isKind(pUsername)) {
            return new userValidityWrapper(false, {
                "error": "Der Nutzername enthält unzulässige Begrifflichkeiten."
            });
        }
        logging.Leaving("getUsernameValidity");
        return logging.ReturnValue(new userValidityWrapper(true, {}));
    }, stringStartsWith: function (array, string) {
        var isCorrect = false;
        for (var x in array) {
            if (typeof array[x] === 'string') {
                isCorrect = isCorrect || string.startsWith("/" + array[x]);
            }
        }

        return isCorrect;
    }, convertIdFields: convertIdFields
};