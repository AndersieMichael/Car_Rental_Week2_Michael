const express = require('express')
const router = express.Router()
const joi = require('joi')
const bcrypt = require('bcrypt')
//function

const allCustomer = require('./function').allCustomer
const customerById = require('./function').customerById
const addCustomer = require('./function').addCustomer
const deleteCustomer = require('./function').deleteCustomer
const updateCustomer = require('./function').updateCustomer
const viewMembershipById = require('./function').viewMembershipById
const checkingNameExist = require('./function').checkingNameExist

const login = require('./auth').loginCustomer
const logout = require('./auth').logoutCustomer
const verifyRefreshToken = require('./auth').validateRefreshToken

//conection to database

const pool = require('./Database/connection').pool

//middleware

const middleware = require('./middleware').customerMiddlware

//view all customer data

router.get('/',async (req,res)=>{
    const pg_client = await pool.connect()
    let[success,result] = await allCustomer(pg_client)
    if(!success){

        console.log(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewAllCustomer"
        };

        res.status(200).json(message)
        return;
    }

    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;

})

//view customer by customer ID

router.get('/view/:id',async(req,res)=>{
    
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
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewCustomerByID"
        };

        res.status(200).json(message)
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

    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;
})

//add customer

router.post('/add',async(req,res)=>{
    
    //validation the body
    
    let joi_template_body = joi.object({
        "name": joi.string().required(),
        "nik": joi.string().required(),
        "phone": joi.string().required(),
        "membership": joi.required(),
        "password":joi.string().required()
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
    let password = joi_body_validation.value["password"];

    const pg_client = await pool.connect()

    if(membership!=null){

        //checking if the membership is exist if not null

        let[msuccess,mresult] = await viewMembershipById(pg_client,membership)
        if(!msuccess){
            console.log(mresult);
            pg_client.release();
            
            const message = {
                "message": "Failed",
                "error_key": "error_internal_server",
                "error_message": mresult,
                "error_data": "ON checkingMembershipByID"
            };

            res.status(200).json(message)
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

    let[nsuccess,nresult] = await checkingNameExist(pg_client,name)
        if(!nsuccess){
            console.log(nresult);
            pg_client.release();
            
            const message = {
                "message": "Failed",
                "error_key": "error_internal_server",
                "error_message": nresult,
                "error_data": "ON checkingNameExist"
            };

            res.status(200).json(message)
            return;
        }
        if(nresult.length != 0){
            const message = {
                "message": "Failed",
                "error_key": "error_name_duplicate",
                "error_message": "Name already registered :: " + name.toString(),
                "error_data": {
                    "ON": "checkingNameExist",
                    "Name": name
                }
            };
            pg_client.release();
            res.status(200).json(message);
            return; //END
        }

    let newPass = await bcrypt.hash(password,10)
        console.log(newPass);
    //insert to database

    let[success,result] = await addCustomer(pg_client,name,nik,phone,membership,newPass)
    if(!success){
        console.log(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON addCustomer"
        };

        res.status(200).json(message)
        return;
    }
    
    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;
})

//update customer by customer id

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
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": cresult,
            "error_data": "ON checkingcustomerByID"
        };

        res.status(200).json(message)
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
            
            const message = {
                "message": "Failed",
                "error_key": "error_internal_server",
                "error_message": mresult,
                "error_data": "ON viewAllCustomer"
            };

            res.status(200).json(message)
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
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON UpdateCustomer"
        };

        res.status(200).json(message)
        return;
    }

    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;

})

//delete customer by customer id

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
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": cresult,
            "error_data": "ON checkingCustomerByID"
        };

        res.status(200).json(message)
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

    // delete customer

    let[success,result] = await deleteCustomer(pg_client,customer_id)
    if(!success){
        console.log(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON deleteCustomer"
        };

        res.status(200).json(message)
        return;
    }
    
    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;
})

//customer login

router.post('/login',async(req,res)=>{
       
    //validation the body
    
    let joi_template_body = joi.object({
        "password": joi.string().required(),
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
    let password = joi_body_validation.value["password"];

    const pg_client = await pool.connect()

    //insert to database

    let[success,result] = await login(pg_client,password,name)
    if(!success){
        console.log(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON tryToLogin"
        };

        res.status(200).json(message)
        return;
    }

     //ID tidak ditemukan

    if(result =="INVALID_PASSWORD"){ 
        console.log(result);
        const message = {
            "message": "Failed",
            "error_key": "error_invalid_password",
            "error_message": "password is wrong for name :: " + name.toString(),
            "error_data": {
                "ON": "loginCustomer"
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
            "error_message": "name is wrong or doesn't exist" ,
            "error_data": {
                "ON": "loginCustomer"
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;

})

//view profile from middleware

router.get('/get/my_profile',middleware,async(req,res)=>{
       
    let cust_id = res.locals.curr_customer_id;

    const pg_client = await pool.connect()

    //insert to database

    let[success,result] = await customerById(pg_client,cust_id)
    if(!success){
        console.log(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewCustomerByMiddleware"
        };

        res.status(200).json(message)
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

    //success

    pg_client.release();
    delete result[0]["token_key"]
    res.status(200).json({"message":"Success","data":result})
    return;

})

//logout customer from middleware

router.post('/logout',middleware,async(req,res)=>{
    let cust_id = res.locals.curr_customer_id;

    const pg_client = await pool.connect()

    //insert to database

    let[success,result] = await logout(pg_client,cust_id)
    if(!success){
        console.log(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON tryToLogout"
        };

        res.status(200).json(message)
        return;
    }

    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;
})

//refresh token if active token expired

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
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON verivyRefreshToken"
        };
        pg_client.release();
        res.status(200).json(message)
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
    
    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;

})


module.exports = router