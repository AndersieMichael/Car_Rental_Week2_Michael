const generateRefreshToken = require('./token').generateRefreshToken;
const generateActiveToken = require('./token').generateActiveToken
const verifyRefreshToken = require('./token').verifyRefreshToken


//login Customer

async function loginCustomer(pg_client,id,name){
    let query
    let value
    let success
    let result

    //get customer

    try {
        query= `select * from customer
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
    
    //id not found

    if(result.length === 0){ 
        result="INVALID_ID"
        return[success,result]; //END
    }

    let cName = result[0]["name"]

    
    //checking name

    if(cName!=name){
        success = true;
        result="INVALID_NAME"
        return[success,result]; //END
    }

    //remove data from array

    data = result[0]

    //remove token key from data that want convert to token

    delete data["token_key"]

    //generate Refresh token
    
    let[refresh_token_success,refresh_token_result] = generateRefreshToken(data)

    if(!refresh_token_success){
        console.log(refresh_token_result);
    }


    //update and insert token key in database 

    try {
        query= `update customer 
                set "token_key" =$2
                where customer_id =$1`
        value=[
            id,
            refresh_token_result
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }

    //generate active token 

    let[Active_token_success,Active_token_result] = generateActiveToken(data)
    if(!Active_token_success){
        console.log(Active_token_success);
    }

    result = {
        "Refresh_Token": refresh_token_result,
        "Access_Token" : Active_token_result
    }

    return[success,result]
}

//logoutCustomer

async function logoutCustomer(pg_client,id){
    let query
    let value
    let success
    let result

    //update the token in database into null

    try {
        query= `update customer 
                set "token_key" =null
                where customer_id =$1`
        value=[
            id
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }

    result = null;

    return[success,result]
}

//checking refresh token

async function validateRefreshToken(pg_client,refresh_token){
    let query
    let value
    let success
    let result

    //verify for refresh token 

    let[refresh_token_success,refresh_token_result] = verifyRefreshToken(refresh_token)

    if(!refresh_token_success){
        console.log(refresh_token_result);
    }

    //if refresh token expired

    if(refresh_token_result == "TokenExpiredError"){
       success=true;
       result = "TOKEN_EXPIRED";
       return[success,result];
    }   
   
    //get customer id from token

    let customer_id = refresh_token_result["customer_id"];
    
    //get token key from database

    try {
        query= `select token_key from customer 
                where customer_id =$1`
        value=[
            customer_id
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

    //compare insert refresh token with refresh token in database

    let tokenInDatabase = result[0]["token_key"];
    if(refresh_token != tokenInDatabase){
        success = true;
        result = "INVALID_TOKEN";
        return [
            success,
            result
        ]; 
    }
    
    let data = refresh_token_result
    
    delete data["exp"]
  
    //generate new active token

    let[Active_token_success,Active_token_result] = generateActiveToken(refresh_token_result)
    if(!Active_token_success){
        console.log(Active_token_success);
    }

    result = {
        "Access_Token" : Active_token_result
    }

    return[success,result]
}


exports.loginCustomer = loginCustomer
exports.logoutCustomer = logoutCustomer
exports.validateRefreshToken = validateRefreshToken