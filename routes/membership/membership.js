//IMPORT
const express = require('express')
const joi = require('joi')
const router = express.Router()
const moment = require("moment")

//FUNCTION

const allMembership = require('./functions').allMembership
const viewMembershipById = require('./functions').viewMembershipById
const addMembership = require('./functions').addMembership
const updateMembership = require('./functions').updateMembership
const deleteMembership = require('./functions').deleteMembership

//logging
const logApiBasic = require('../../utilities/slack').logApiBasic;

//connection

const pool = require('../../utilities/connection').pool

let head_route_name = "/membership"

//view all membership

router.get('/',async (req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    const pg_client = await pool.connect()
    let[success,result] = await allMembership(pg_client)
    if(!success){
        
        //Error

        console.error(result);
        pg_client.release();

        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewAllMembership"
        };

        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        res.status(200).json(message)
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

//view membership by id

router.get('/view/:id',async (req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

     //joi validation
     let joi_template = joi.number().required();

     let joi_validate = joi_template.validate(req.params.id);
     if(joi_validate.error){
        const message = {
             "message": "Failed",
             "error_key": "error_param",
             "error_message": joi_validate.error.stack,
             "error_data": joi_validate.error.details
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
    const membership_id = req.params.id
    const pg_client = await pool.connect()

    let[success,result] = await viewMembershipById(pg_client,membership_id)
    if(!success){
        
        //Error
        
        console.error(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewMembershipById"
        };
        
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );

        res.status(200).json(message)
        return; //END
    }
    if(result.length === 0){
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + membership_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": membership_id
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
    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
    
})

//add membership

router.post('/add',async(req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    let joi_template = joi.object({
        "name": joi.string().required(),
        "discount": joi.number().required(),
    }).required();

    //validation the body

    let joi_body_validation = joi_template.validate(req.body);
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
    let discount = joi_body_validation.value["discount"];
    
    const pg_client = await pool.connect()

    let[success,result] = await addMembership(pg_client,name,discount)
    if(!success){
        
        //Error
        
        console.error(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON addMembership"
        };
        
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );

        res.status(200).json(message)
        return; //END
    }
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    
})

//update membership by membershipid

router.put('/update/:id',async(req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    //joi validation paramenter

    let joi_template_param = joi.number().required();

    let joi_validate = joi_template_param.validate(req.params.id);
    if(joi_validate.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_validate.error.stack,
            "error_data": joi_validate.error.details
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
        "discount": joi.number().required(),
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
    let discount = joi_body_validation.value["discount"];

    const membership_id = req.params.id
    const pg_client = await pool.connect()

    //check if the id exist
    
    let[Msuccess,Mresult] = await viewMembershipById(pg_client,membership_id)
    if(!Msuccess){
        
        //Error
        
        console.error(Mresult);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": Mresult,
            "error_data": "ON checkIdExist"
        };
        
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );

        res.status(200).json(message)
        return;
    }

    //ID tidak ditemukan

    if(Mresult.length === 0){ 
        
        //Error
        
        console.error(Mresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + membership_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": membership_id
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

    //send data to updated

    let[success,result] = await updateMembership(pg_client,membership_id,name,discount)
    if(!success){
        
        //Error
        
        //Error
        
        console.error(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON updateMembership"
        };
        
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );

        res.status(200).json(message)
        return; //END
    }
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
})

//delete membership by membershipid

router.delete('/delete/:id',async(req,res)=>{
    
    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())
    
    //joi validation paramenter

    let joi_template_param = joi.number().required();

    let joi_validate = joi_template_param.validate(req.params.id);
    if(joi_validate.error){
        const message = {
            "message": "Failed",
            "error_key": "error_param",
            "error_message": joi_validate.error.stack,
            "error_data": joi_validate.error.details
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

    const membership_id = req.params.id
    const pg_client = await pool.connect()

    //check if the id exist
    
    let[Msuccess,Mresult] = await viewMembershipById(pg_client,membership_id)
    if(!Msuccess){
        
        //Error
        
        console.error(Mresult);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": Mresult,
            "error_data": "ON checkIdExist"
        };
        
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );

        res.status(200).json(message)
        return; //END
    }

    //ID tidak ditemukan

    if(Mresult.length === 0){ 
        
        //Error
        
        console.error(Mresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + membership_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": membership_id
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

    //delete membership

    let[success,result] = await deleteMembership(pg_client,membership_id)
    if(!success){
        
        //Error
        
        console.error(result);
        pg_client.release();
        
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON checkIdExist"
        };
        
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );

        res.status(200).json(message)
        return; //END
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

module.exports = router