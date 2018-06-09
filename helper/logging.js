/*********************************************************************************/
/** Logging **/
/** ****************************************************************************** */

var fs = require('file-system');
const logFilePath = "../admin/logs";

function writeToLogFile(pLogFileName, pMessage) {
    fs.appendFile(logFilePath + "/" + pLogFileName, getCurrentDateTime() + " " + pMessage + "\n", function (err) {
        if (err) {
            return console.log(err); // NOSONAR
        }
        console.log(pMessage); // NOSONAR
    });
}

function getCurrentDateTime() {
    let d = String(new Date());
    return d.substring(0, d.lastIndexOf("GMT"));
}

function deleteLogFiles() {
    fs.readdirSync('../logs/').forEach(file => {
        fs.unlinkSync('../logs/' + file);
    });
}

module.exports = {
    initLogging: function () {
        // Es muss das logging-Verzeichnis existieren, sonst fliegen Fehler!
        if (!fs.existsSync(logFilePath)) {
            fs.mkdirSync(logFilePath);
        }
    },

    deleteLogFiles: function () {
        fs.readdirSync(logFilePath + '/').forEach(file => {
            fs.unlinkSync(logFilePath + '/' + file);
        });
    },

    Info: function (pInfomessage) { // NOSONAR
        infoMessage(pInfomessage);
    },

    Error: function (pErrormessage) { // NOSONAR
        writeToLogFile("error.log", "[" + timeStamp() + "]" + "[ERROR] " + JSON.stringify(pErrormessage));
    },

    Parameter: function (pParameterName, pParameterValue) { // NOSONAR
        writeToLogFile("parameter.log", "[" + timeStamp() + "]" + "[PARAMETER] " + JSON.stringify(pParameterName) + " -> " + JSON.stringify(pParameterValue));
    },

    Entering: function (pFunctionName) { // NOSONAR
        infoMessage(pFunctionName + " ENTRY");
    },

    Leaving: function (pFunctionName) { // NOSONAR
        infoMessage(pFunctionName + " LEAVING");
    },

    ReturnValue: function (pParameterValue) { // NOSONAR
        writeToLogFile("parameter.log", "[" + timeStamp() + "]" + "[PARAMETER] RETURN " + JSON.stringify(pParameterValue));
        return pParameterValue;
    }

};

function infoMessage(pInfomessage) {
    writeToLogFile("info.log", "[" + timeStamp() + "]" + "[INFO] " + JSON.stringify(pInfomessage));
}

function timeStamp() {
    let curTimeStamp = new Date();
    return curTimeStamp.getDate() + "." + (curTimeStamp.getMonth() + 1) + "." + (curTimeStamp.getFullYear() + " - " + curTimeStamp.getHours() + ":" + curTimeStamp.getMinutes())
        + ":" + curTimeStamp.getSeconds() + "." + curTimeStamp.getMilliseconds();
}
