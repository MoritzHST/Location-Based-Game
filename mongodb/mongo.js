const fs = require('file-system');
const MongoClient = require('mongodb').MongoClient;
const logging = require('./logging');
const _conf = '../mongod.conf';

const Conf = {
    port: '27017',
    bindIp: '127.0.0.1',
    defaultDb: 'LocationBasedGame'
};

/**
 * Sucht innerhalb der _conf Datei nach angegebenen Mongo-Konfigurationen
 * und ersetzt im Erfolgsfall die im Mongo-Objekt angegebenen mit dem ersten Treffer (der Zeile)
 */

const file = require('path').resolve(__dirname, _conf);

if (!fs.existsSync(file)) {
    logging.Error(_conf + " ist nicht lesbar oder existiert nicht");
} else {
    var content = fs.readFileSync(file, 'utf8').toString();
    var delimeters = [',', '#'];
    var lines = content.split('\n');

    for (var key in Conf) {
        if (Conf.hasOwnProperty(key)) {
            prepareDB(lines, key, delimeters);
        }
    }
}

function prepareDB(lines, key, delimeters) {
    for (var line = 0; line < lines.length; line++) {
        var keyIndex = lines[line].indexOf(key + ":");

        if (keyIndex >= 0 && !lines[line].trim().startsWith("#")) {
            var value = lines[line].trim().substring(keyIndex + key.length);
            value = getValue(delimeters, value);
            Conf[key] = value;
        }
    }
}

function getValue(delimeters, value) {
    for (var i = 0; i < delimeters.length; i++) {
        if (value.includes(delimeters[i])) {
            return value.substring(0, value.indexOf(delimeters[i])).trim();
        }
    }
}

function MongoWrapper(database) {
    this.Client = MongoClient;
    this.Url = 'mongodb://' + Conf.bindIp + ':' + Conf.port;
    this.Database = database ? database : Conf.defaultDb;
}


module.exports = {
    Object: function (database) {
        return new MongoWrapper(database);
    }
};
