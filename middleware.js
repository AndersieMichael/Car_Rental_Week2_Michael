const res = require('express/lib/response');

const verify = require('./token').verifyAccessToken
// const getdata = require('./auth').getCustomerData
const pool = require('./Database/connection').pool

function getTokenFromHeader(req){
    let header_target = "authorization";
    header_target = header_target.toLowerCase();
    if(req.headers[header_target]){
        return req.headers[header_target].toString().split("Bearer ")[1];
    }
    return null;
}

async function getCustomerData(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select * from booking
                where customer_id=$1`
        value=[
            id
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}

async function customerMiddleware(req,res,next){
    // let data_toview_on_error = {
    //     "Header" : req.headers
    // }
    console.log("masuk");
    const token = getTokenFromHeader(req)

    if(token==null || token==undefined){
        const message = {
            "message": "Failed",
            "error_key": "error_no_auth_token",
            "error_message": `Token doesnt exists`,
            "error_data": {
                "Request_Headers": req.headers
            }
        };
        res.status(401).json(message);
        return; //END 
    }

    let [verify_success,verify_result] = verify(token)

    console.log(JSON.stringify(verify_result, null, 2));
    if(!verify_success){
      console.log(verify_result);
      const message = {
          "message": "Failed",
          "error_key": "error_invalid_token",
          "error_message": "Invalid token",
          "error_data": {
            "Request_Headers": req.headers
        }
      };
      res.status(401).json(message);
      return; //END
    }

    if(verify_result == "TokenExpiredError"){
        console.log(verify_result);
        const message = {
            "message": "Failed",
            "error_key": "error_expired_token",
            "error_message": "Token Expired",
            "error_data": {
              "Request_Headers": req.headers
          }
        };
        res.status(401).json(message);
        return; //END
    }   

    let customer_id = verify_result["customer_id"];

    const pg_client = await pool.connect()
    let [customer_success, customer_result] = await getCustomerData(pg_client,customer_id);

    if (!customer_success){
        console.log(customer_result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": customer_result,
            "error_data": "ON getCustomerData"
        };
        res.status(200).json(message);
        return; //END
    }

 // ID NOT FOUND
    if (customer_result === 0){
        console.log(customer_result);
        const message = {
            "message": "Failed",
            "error_key": "error_invalid_token",
            "error_message": "Cant found data with id on token :: " + customer_id.toString(),
            "error_data": {
                "ON": "getCustomerData",
                "ID": customer_id
            }
        }
        res.status(401).json(message);
        return; //END
    }        

    res.local.curr_customer_id = customer_id;
    res.local.curr_customer_data = customer_result;

    

    next();
}

exports.customerMiddlware = customerMiddleware