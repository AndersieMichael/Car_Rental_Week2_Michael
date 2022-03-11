const moment = require("moment")

// const updateTokenKey = require('./function').updateTokenKey
const generateRefreshToken = require('./token').generateRefreshToken;
const generateActiveToken = require('./token').generateActiveToken


//login Customer

async function loginCustomer(pg_client,id,name){
    let query
    let value
    let success
    let result

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

    let[refresh_token_success,refresh_token_result] = generateRefreshToken(data)

    if(!refresh_token_success){
        console.log(refresh_token_result);
    }

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


    let[Active_token_success,Active_token_result] = generateActiveToken(data)
    if(!Active_token_success){
        console.log(refresh_token_result);
    }

    result = {
        "Refresh_Token": refresh_token_result,
        "Access_Token" : Active_token_result
    }

    return[success,result]
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




exports.loginCustomer = loginCustomer
exports.getCustomerData = getCustomerData