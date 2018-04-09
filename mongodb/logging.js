/*********************************************************************************/
/** Logging **/
/*********************************************************************************/
module.exports = {

    Info: function (pInfomessage) {
        console.log("[INFO] " + pInfomessage);
    },

    Error: function (pErrormessage) {
        console.log("[ERROR] " + pErrormessage);
    },

    Parameter: function (pParameterName, pParameterValue) {
        console.log("[PARAMETER] " + pParameterName + " -> " + pParameterValue);
    }
}