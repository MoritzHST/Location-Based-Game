const fs = require('file-system');
const MongoClient = require('mongodb').MongoClient;
const logging = require('../helper/logging');
const _conf = '../mongod.conf';

const Conf = {
    port : '27017',
    bindIp : '127.0.0.1',
    connectionAttempts: 10,
    defaultDb : 'LocationBasedGame'
};

/**
 * Sucht innerhalb der _conf Datei nach angegebenen Mongo-Konfigurationen
 * und ersetzt im Erfolgsfall die im Mongo-Objekt angegebenen mit dem ersten Treffer (der Zeile)
 */

const file = require('path').resolve(__dirname, _conf);

if (process.env.conf !== "false") {
    logging.Info("Lese " + _conf + " ein...");
    if (!fs.existsSync(file)) {
        logging.Error(_conf + " ist nicht lesbar oder existiert nicht");
    } else {
        var content = fs.readFileSync(file, 'utf8').toString();
        var delimeters = [ ',', '#' ];
        var lines = content.split('\n');

        for ( var key in Conf) {
            if (Conf.hasOwnProperty(key)) {
                for (var line = 0; line < lines.length; line++) { // NOSONAR
                    Conf[key] = extractValue(delimeters, lines, line, key) ? extractValue(delimeters, lines, line, key) : Conf[key];
                }
            }
        }
    }
}

function extractValue(pDelimeters, pLines, pLine, pKey) {
    var keyIndex = pLines[pLine].indexOf(pKey + ":");

    if (keyIndex >= 0 && !pLines[pLine].trim().startsWith("#")) {
        var value = pLines[pLine].trim().substring(keyIndex + pKey.length);

        for (var i = 0; i < pDelimeters.length; i++) {
            if (value.includes(pDelimeters[i])) {
                value = value.substring(0, value.indexOf(pDelimeters[i])).trim();
            }
        }

        logging.Info(Conf[pKey] + "=" + value);
        return value;
    }
}

function MongoWrapper(database) {
    logging.Info("Initializing new MongoWrapper");
    this.Client = MongoClient;
    this.Url = 'mongodb://' + Conf.bindIp + ':' + Conf.port;
    this.Database = database ? database : Conf.defaultDb;
}

module.exports = {
    Object : function(database) {
        return new MongoWrapper(database);
    },
    Conf
};