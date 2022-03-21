//IMPORT
const axios = require('axios').default;


function logApiBasic(error_text, error_trace, extra_data = '-') {
    let url_hook = "https://hooks.slack.com/services/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"
    
    const header ={
        'Content-type':'application/json'
    }

    const body ={
        "text": error_text.toString() + " ! \n ```" + error_trace.toString() + "``` \n ```" + extra_data.toString() + "``` "
    
    }


    //SEND TO HOOK
    axios.post(url_hook,body,{ headers : header}).then(()=>{
        console.log("Parshing slack-logging Done");
    }).catch(()=>{
        console.log("Parshing - Logging Fail");
    })
}

exports.logApiBasic = logApiBasic;