var debugMode = true

// This function logs console messages when debugMode is true .
function debugLog(logMessage) {
    if (debugMode) {
        console.log(logMessage);
    }
}

// Use the function instead of console.log
// debugLog("This is a debug message");


module.exports = debugLog