const express = require('express')
const router = express.Router()
const joi = require('joi')
const allCustomer = require('./function').allCustomer
const customerById = require('./function').customerById
const addCustomer = require('./function').addCustomer
const deleteCustomer = require('./function').deleteCustomer
const updateCustomer = require('./function').updateCustomer
const viewMembershipById = require('./function').viewMembershipById

const login = require('./auth').loginCustomer
const logout = require('./auth').logoutCustomer
const verifyRefreshToken = require('./auth').validateRefreshToken
const pool = require('./Database/connection').pool

const middleware = require('./middleware').customerMiddlware


router.get('/',async (req,res)=>{
    const pg_client = await pool.connect()
    let[success,result] = await allCustomer(pg_client)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.get('/:id',async(req,res)=>{
    
    //joi validation param

    let joi_template_param = joi.number().required();

    let joi_validate_param = joi_template_param.validate(req.params.id);
    if(joi_validate_param.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_validate_param.error.stack,
            "error_data": joi_validate_param.error.details
        };
        res.status(200).json(message);
        return; //END
    }

    //create pg client

    const customer_id = req.params.id
    const pg_client = await pool.connect()
    let[success,result] = await customerById(pg_client,customer_id)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }

    //ID tidak ditemukan

    if(result.length === 0){ 
        console.log(result);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + customer_id.toString(),
            "error_data": {
                "ON": "Customer_id_Exist",
                "ID": customer_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    
})

router.post('/add/newCust',async(req,res)=>{
    
    //validation the body
    
    let joi_template_body = joi.object({
        "name": joi.string().required(),
        "nik": joi.string().required(),
        "phone": joi.string().required(),
        "membership": joi.required(),
    }).required();
    
    let joi_body_validation = joi_template_body.validate(req.body);
    if(joi_body_validation.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_body_validation.error.stack,
            "error_data": joi_body_validation.error.details
        };
        res.status(200).json(message);
        return; //END

    }
    let name = joi_body_validation.value["name"];
    let nik = joi_body_validation.value["nik"];
    let phone = joi_body_validation.value["phone"];
    let membership = joi_body_validation.value["membership"];

    const pg_client = await pool.connect()

    if(membership!=null){

       //checking if the membership is exist if not null

        let[msuccess,mresult] = await viewMembershipById(pg_client,membership)
        if(!msuccess){
            console.log(mresult);
            pg_client.release();
            res.status(200).json({"message":"Error","data":mresult})
            return;
        }
        if(mresult.length === 0){
            const message = {
                "message": "Failed",
                "error_key": "error_id_not_found",
                "error_message": "Cant found data with id :: " + membership.toString(),
                "error_data": {
                    "ON": "Membership_id_Exist",
                    "ID": membership
                }
            };
            pg_client.release();
            res.status(200).json(message);
            return; //END
        }
    }

    //insert to database

    let[success,result] = await addCustomer(pg_client,name,nik,phone,membership)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.put('/update/:id',async(req,res)=>{
    
    //joi validation param

    let joi_template_param = joi.number().required();

    let joi_validate_param = joi_template_param.validate(req.params.id);
    if(joi_validate_param.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_validate_param.error.stack,
            "error_data": joi_validate_param.error.details
        };
        res.status(200).json(message);
        return; //END
    }

        
    //validation the body
    
    let joi_template_body = joi.object({
        "name": joi.string().required(),
        "nik": joi.string().required(),
        "phone": joi.string().required(),
        "membership": joi.required(),
    }).required();
    
    let joi_body_validation = joi_template_body.validate(req.body);
    if(joi_body_validation.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_body_validation.error.stack,
            "error_data": joi_body_validation.error.details
        };
        res.status(200).json(message);
        return; //END

    }
    let name = joi_body_validation.value["name"];
    let nik = joi_body_validation.value["nik"];
    let phone = joi_body_validation.value["phone"];
    let membership = joi_body_validation.value["membership"];


    const customer_id = req.params.id
    const pg_client = await pool.connect()
    let[csuccess,cresult] = await customerById(pg_client,customer_id)
    if(!csuccess){
        console.log(cresult);
        pg_client.release();
        return;
    }

    //ID tidak ditemukan

    if(cresult.length === 0){ 
        console.log(cresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + customer_id.toString(),
            "error_data": {
                "ON": "Customer_ID_Exist",
                "ID": customer_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }


    //checking for membership exist

    if(membership!=null){

        //checking if the membership is exist if not null
 
         let[msuccess,mresult] = await viewMembershipById(pg_client,membership)
         if(!msuccess){
             console.log(mresult);
             pg_client.release();
             res.status(200).json({"message":"Error","data":mresult})
             return;
         }
         if(mresult.length === 0){
             const message = {
                 "message": "Failed",
                 "error_key": "error_id_not_found",
                 "error_message": "Cant found data with id :: " + membership.toString(),
                 "error_data": {
                     "ON": "Membership_ID_Exist",
                     "ID": membership
                 }
             };
             pg_client.release();
             res.status(200).json(message);
             return; //END
         }
     }
 

    //send to update data

    let[success,result] = await updateCustomer(pg_client,customer_id,name,nik,phone,membership)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }

})

router.delete('/delete/:id',async(req,res)=>{

        
    //joi validation param

    let joi_template_param = joi.number().required();

    let joi_validate_param = joi_template_param.validate(req.params.id);
    if(joi_validate_param.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_validate_param.error.stack,
            "error_data": joi_validate_param.error.details
        };
        res.status(200).json(message);
        return; //END
    }

    const customer_id = req.params.id
    const pg_client = await pool.connect()
    let[csuccess,cresult] = await customerById(pg_client,customer_id)
    if(!csuccess){
        console.log(cresult);
        pg_client.release();
        return;
    }

    //ID tidak ditemukan

    if(cresult.length === 0){ 
        console.log(cresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + customer_id.toString(),
            "error_data": {
                "ON": "Customer_ID_EXIST",
                "ID": customer_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    let[success,result] = await deleteCustomer(pg_client,customer_id)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.post('/login',async(req,res)=>{
       
    //validation the body
    
    let joi_template_body = joi.object({
        "customerID": joi.number().required(),
        "name": joi.string().required(),
    }).required();
    
    let joi_body_validation = joi_template_body.validate(req.body);
    if(joi_body_validation.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_body_validation.error.stack,
            "error_data": joi_body_validation.error.details
        };
        res.status(200).json(message);
        return; //END

    }

    //parameter

    let name = joi_body_validation.value["name"];
    let customer_Id = joi_body_validation.value["customerID"];

    const pg_client = await pool.connect()

    //insert to database

    let[success,result] = await login(pg_client,customer_Id,name)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }

     //ID tidak ditemukan

    if(result =="INVALID_ID"){ 
        console.log(result);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found id :: " + customer_Id.toString(),
            "error_data": {
                "ON": "Customer_id_Exist",
                "ID": customer_Id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //checking name

    if(result =="INVALID_NAME"){
        const message = {
            "message": "Failed",
            "error_key": "error_invalid_name",
            "error_message": "name is wrong for id :: " + customer_Id.toString(),
            "error_data": {
                "ON": "loginCustomer"
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})


})

router.get('/get/my_profile',middleware,async(req,res)=>{
       
    let cust_id = res.locals.curr_customer_id;
    const pg_client = await pool.connect()

    //insert to database

    let[success,result] = await customerById(pg_client,cust_id)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }

    //ID tidak ditemukan

    if(result.length === 0){ 
        console.log(result);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + cust_id.toString(),
            "error_data": {
                "ON": "Customer_id_Exist",
                "ID": cust_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

        pg_client.release();
        delete result[0]["token_key"]
        res.status(200).json({"message":"Success","data":result})


})

router.post('/logout',middleware,async(req,res)=>{
    let cust_id = res.locals.curr_customer_id;
    const pg_client = await pool.connect()

    //insert to database

    let[success,result] = await logout(pg_client,cust_id)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
})

router.post('/refresh_token',async(req,res)=>{
       
    //validation the body
    
    let joi_template_body = joi.object({
        "refresh_token": joi.string().required(),
    }).required();
    
    let joi_body_validation = joi_template_body.validate(req.body);
    if(joi_body_validation.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_body_validation.error.stack,
            "error_data": joi_body_validation.error.details
        };
        res.status(200).json(message);
        return; //END

    }

    //parameter

    let refresh = joi_body_validation.value["refresh_token"];


    const pg_client = await pool.connect()

    //insert to database

    let[success,result] = await verifyRefreshToken(pg_client,refresh)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }

     //token expired

    if(result =="TOKEN_EXPIRED"){ 
        console.log(result);
        const message = {
            "message": "Failed",
            "error_key": "error_refresh_token_expired",
            "error_message": "Refresh token is expired, please re-login",
            "error_data": "ON refreshTokenCustomer"
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //invalid token

    if(result =="INVALID_TOKEN"){
        console.log(result);
        const message = {
            "message": "Failed",
            "error_key": "error_refresh_token_invalid",
            "error_message": "Refresh token is invalid, please re-login",
            "error_data": "ON refreshTokenAuthor"
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})


})


module.exports = router