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
        deleteLogFiles : function() {
            fs.readdirSync(logFilePath + '/').forEach(file => {
                fs.unlinkSync(logFilePath + '/' + file);
            });
        },

        Info : function(pInfomessage) {
            infoMessage(pInfomessage);
        },

        Error : function(pErrormessage) {
            writeToLogFile("error.log", "[ERROR] " + JSON.stringify(pErrormessage));
        },

        Parameter : function(pParameterName, pParameterValue) {
            writeToLogFile("parameter.log", "[PARAMETER] " + JSON.stringify(pParameterName) + " -> " + JSON.stringify(pParameterValue));
        },

    Entering: function (pFunctionName) {
        infoMessage(pFunctionName + " ENTRY");
    },

    Leaving: function (pFunctionName) {
        infoMessage(pFunctionName + " LEAVING");
    },

    ReturnValue: function (pParameterValue) {
        writeToLogFile("parameter.log", "[PARAMETER] RETURN " + JSON.stringify(pParameterValue));
        }

    };

function infoMessage(pInfomessage) {
    writeToLogFile("info.log", "[INFO] " + JSON.stringify(pInfomessage));
}