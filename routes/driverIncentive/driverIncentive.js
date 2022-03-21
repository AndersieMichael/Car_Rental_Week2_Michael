//IMPORT
const express = require('express')
const router = express.Router()
const joi = require('joi')
const moment = require("moment")

//FUNCTION

const allIncentive= require('./functions').allIncentive
const viewIncentivebyId = require('./functions').viewIncentiveById
const addIncentive = require('./functions').addDriverIncentive
const updateIncentive = require('./functions').updateIncentiveById
const deleteIncentive = require('./functions').deleteIncentive

//logging
const logApiBasic = require('../../utilities/slack').logApiBasic;

//connection

const pool = require('../../utilities/connection').pool

let head_route_name = "/incentive"

//view all driverIncentive

router.get('/',async (req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())
 

    const pg_client = await pool.connect()
    let[success,result] = await allIncentive(pg_client)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewAllDriverIncentive"
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

//view  driverIncentive by incentive id

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

    const incentive_id = req.params.id

    const pg_client = await pool.connect()
    let[success,result] = await viewIncentivebyId(pg_client,incentive_id)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewIncentiveByID"
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
            "error_message": "Cant found data with id :: " + incentive_id.toString(),
            "error_data": {
                "ON": "incentive_id_EXIST",
                "ID": incentive_id
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

//add driverIncentive 

router.post('/add',async (req,res)=>{
    
    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    //validation the body
    
    let joi_template_body = joi.object({
        "booking": joi.number().required(),
        "insentive": joi.number().required(),
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
    let booking = joi_body_validation.value["booking"];
    let insentive = joi_body_validation.value["insentive"];

    //add to database

    const pg_client = await pool.connect()
    let[success,result] = await addIncentive(pg_client,booking,insentive);
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON addDriverIncentive"
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

//update driverIncentive by incentive id

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
        "booking": joi.number().required(),
        "insentive": joi.number().required(),
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

    let booking = joi_body_validation.value["booking"];
    let insentive = joi_body_validation.value["insentive"];


    const incentive_id = req.params.id

    const pg_client = await pool.connect()

    //checking id

    let[isuccess,iresult] = await viewIncentivebyId(pg_client,incentive_id)
    if(!isuccess){
        
        //Error
        
        console.error(iresult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": iresult,
            "error_data": "ON checkingIncentivebyID"
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

    if(iresult.length === 0){ 
        
        //Error
        
        console.error(iresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + incentive_id.toString(),
            "error_data": {
                "ON": "incentive_id_EXIST",
                "ID": incentive_id
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

    let[success,result] = await updateIncentive(pg_client,incentive_id,booking,insentive);
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON updateIncentive"
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

//delete drivrIncentive by incentive id

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

    const incentive_id = req.params.id
    const pg_client = await pool.connect()

    
    //checking id

    let[isuccess,iresult] = await viewIncentivebyId(pg_client,incentive_id)
    if(!isuccess){
        
        //Error
        
        console.error(iresult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": iresult,
            "error_data": "ON checkingIncentiveByID"
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

    if(iresult.length === 0){ 
        
        //Error
        
        console.error(iresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + incentive_id.toString(),
            "error_data": {
                "ON": "incentive_id_EXIST",
                "ID": incentive_id
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

    //send data to delete

    let[success,result] = await deleteIncentive(pg_client,incentive_id);
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON deleteIncentive"
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