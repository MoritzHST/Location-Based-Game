/*********************************************************************************/
/** Logging **/
/*********************************************************************************/

var fs = require('file-system');
const logFilePath = "../admin/logs";

function writeToLogFile(pLogFileName, pMessage) {
    fs.appendFile(logFilePath + "/" + pLogFileName, getCurrentDateTime() + " " + pMessage + "\n", function(err) {
        if (err) {
            return console.log(err);
        }

        console.log(pMessage);
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
        //Es muss das logging-Verzeichnis existieren, sonst fliegen Fehler!
        if (!fs.existsSync(logFilePath)) {
            fs.mkdirSync(logFilePath);
        }
    },

        deleteLogFiles : function() {
            fs.readdirSync(logFilePath + '/').forEach(file => {
                fs.unlinkSync(logFilePath + '/' + file);
            });
        },

        Info : function(pInfomessage) {
            infoMessage(pInfomessage);
        },

        Error : function(pErrormessage) {
            writeToLogFile("error.log", "[" + timeStamp() + "]" + "[ERROR] " + JSON.stringify(pErrormessage));
        },

        Parameter : function(pParameterName, pParameterValue) {
            writeToLogFile("parameter.log", "[" + timeStamp() + "]" + "[PARAMETER] " + JSON.stringify(pParameterName) + " -> " + JSON.stringify(pParameterValue));
        },

    Entering: function (pFunctionName) {
        infoMessage(pFunctionName + " ENTRY");
    },

    Leaving: function (pFunctionName) {
        infoMessage(pFunctionName + " LEAVING");
    },

    ReturnValue: function (pParameterValue) {
        writeToLogFile("parameter.log", "[" + timeStamp() + "]" + "[PARAMETER] RETURN " + JSON.stringify(pParameterValue));
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
