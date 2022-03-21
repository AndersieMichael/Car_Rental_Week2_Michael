//IMPORT
const express = require('express')
const router = express.Router()
const joi = require('joi')
const moment = require("moment")

//function

const allDriver = require('./functions').allDriver
const viewDriverbyId = require('./functions').viewDriverById
const addDriver = require('./functions').addDriver
const updateDriver = require('./functions').updateDriver
const deleteDriver = require('./functions').deleteDriver

//logging
const logApiBasic = require('../../utilities/slack').logApiBasic;

//connection

const pool = require('../../utilities/connection').pool

let head_route_name = "/driver"

//view all driver

router.get('/',async (req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    const pg_client = await pool.connect()
    let[success,result] = await allDriver(pg_client)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewAllDriver"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }

    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;

})

//view driver from driver id

router.get('/view/:id',async (req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        res.status(200).json(message);
        return; //END
    }

    //view driver By ID

    const driver_id = req.params.id
    const pg_client = await pool.connect()
    let[success,result] = await viewDriverbyId(pg_client,driver_id)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewDriverByID"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }

    //ID tidak ditemukan

    if(result.length === 0){ 
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + driver_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": driver_id
            }
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }
    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;

})

// add driver

router.post('/add',async (req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    //validation the body
    
    let joi_template_body = joi.object({
        "name": joi.string().required(),
        "nik": joi.string().required(),
        "phone": joi.string().required(),
        "cost": joi.number().required(),
    }).required();
    
    let joi_body_validation = joi_template_body.validate(req.body);
    if(joi_body_validation.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_body_validation.error.stack,
            "error_data": joi_body_validation.error.details
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        res.status(200).json(message);
        return; //END
    }
    let name = joi_body_validation.value["name"];
    let nik = joi_body_validation.value["nik"];
    let phone = joi_body_validation.value["phone"];
    let cost = joi_body_validation.value["cost"];

    //add driver

    const pg_client = await pool.connect()
    let[success,result] = await addDriver(pg_client,name,nik,phone,cost)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON addDriver"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }

    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;

})

//update driver from driver id

router.put('/update/:id',async (req,res)=>{
    
    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        res.status(200).json(message);
        return; //END
    }
 
    //validation the body
    
    let joi_template_body = joi.object({
        "name": joi.string().required(),
        "nik": joi.string().required(),
        "phone": joi.string().required(),
        "cost": joi.number().required(),
    }).required();
    
    let joi_body_validation = joi_template_body.validate(req.body);
    if(joi_body_validation.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_body_validation.error.stack,
            "error_data": joi_body_validation.error.details
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        res.status(200).json(message);
        return; //END
    }
    let name = joi_body_validation.value["name"];
    let nik = joi_body_validation.value["nik"];
    let phone = joi_body_validation.value["phone"];
    let cost = joi_body_validation.value["cost"];

    //make pgClient

    const driver_id = req.params.id
    const pg_client = await pool.connect()

    //checking IF ID Exist

    let[dsuccess,dresult] = await viewDriverbyId(pg_client,driver_id)
    if(!dsuccess){
        
        //Error
        
        console.error(dresult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": dresult,
            "error_data": "ON checkingDriverID"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }

    //ID tidak ditemukan

    if(dresult.length === 0){ 
        
        //Error
        
        console.error(dresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + driver_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": driver_id
            }
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //send data to update

    let[success,result] = await updateDriver(pg_client,driver_id,name,nik,phone,cost)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON updateDriver"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }

    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;

})

//delete driver from driver id

router.delete('/delete/:id',async (req,res)=>{
    
    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())
    
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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        res.status(200).json(message);
        return; //END
    }
    
    //make PG CLient
    const driver_id = req.params.id
    const pg_client = await pool.connect()

    //checking IF ID Exist

    let[dsuccess,dresult] = await viewDriverbyId(pg_client,driver_id)
    if(!dsuccess){
        
        //Error
        
        console.error(dresult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": dresult,
            "error_data": "ON checkingDriverID"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }

    //ID tidak ditemukan

    if(dresult.length === 0){ 
        
        //Error
        
        console.error(dresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + driver_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": driver_id
            }
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //Delete Data

    let[success,result] = await deleteDriver(pg_client,driver_id)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON deleteDriver"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }

    //success

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    return;
    
})


module.exports = router