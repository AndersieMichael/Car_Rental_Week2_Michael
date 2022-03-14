const jwt = require('jsonwebtoken');
const fs = require('fs');

let key_private = fs.readFileSync('./tokenFile/private.key','utf8');
let key_public = fs.readFileSync('./tokenFile/public.key','utf8');
const refresh_key ="test";

function generateRefreshToken(Customer_data){
    let success;
    let refresh_token;

    try {
        refresh_token = jwt.sign(Customer_data,refresh_key,{
            expiresIn:'1d',
            algorithm: "HS256"
        })

        success=true;

    } catch (err) {
        console.log(err.message);
        refresh_token = err.message;
        success = false;
    }
    return[success,refresh_token]

}

function generateActiveToken(Customer_data){
    let success;
    let access_token;
    
    try {
        access_token = jwt.sign(Customer_data,key_private,{
            expiresIn:'15m',
            algorithm : "RS256"
        })
        success = true;
        
    } catch (err) {
        console.log(err.message);
        access_token=err.message;
        success = false;
    }

    return [success,access_token]
}

function verifyAccessToken(token){
    let success
    let valid_data;

    try {
        valid_data = jwt.verify(token,key_public,{
            algorithms:"RS256"
        })
        success = true

    } catch (err) {
        console.log(err.message);
        valid_data = err.message;
        success = false;

        // EXPIRED
        if(err.name == "TokenExpiredError"){
            success = true;
            valid_data = "TokenExpiredError";
        }
    }

    return [success,valid_data];
}

function verifyRefreshToken(token){
    let success;
    let refresh_token;

    try {
        refresh_token = jwt.verify(token,refresh_key,{
            algorithms:"HS256"
        })
        success = true

        success=true;

    } catch (err) {
        console.log(err.message);
        refresh_token = err.message;
        success = false;
    }
    return[success,refresh_token]

}


exports.generateRefreshToken = generateRefreshToken
exports.generateActiveToken = generateActiveToken
exports.verifyAccessToken = verifyAccessToken
exports.verifyRefreshToken = verifyRefreshToken