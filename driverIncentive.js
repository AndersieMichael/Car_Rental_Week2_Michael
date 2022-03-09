const express = require('express')
const router = express.Router()
const joi = require('joi')
const allIncentive= require('./function').allIncentive
const viewIncentivebyId = require('./function').viewIncentiveById
const addIncentive = require('./function').addDriverIncentive
const updateIncentive = require('./function').updateIncentiveById
const deleteIncentive = require('./function').deleteIncentive
const pool = require('./Database/connection').pool


router.get('/',async (req,res)=>{
    const pg_client = await pool.connect()
    let[success,result] = await allIncentive(pg_client)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.get('/:id',async (req,res)=>{
        
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

    const incentive_id = req.params.id
    const pg_client = await pool.connect()
    let[success,result] = await viewIncentivebyId(pg_client,incentive_id)
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
            "error_message": "Cant found data with id :: " + incentive_id.toString(),
            "error_data": {
                "ON": "incentive_id_EXIST",
                "ID": incentive_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    pg_client.release();
    res.status(200).json({"message":"Success","data":result})
})

router.post('/add',async (req,res)=>{
    
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
        res.status(200).json(message);
        return; //END

    }
    let booking = joi_body_validation.value["booking"];
    let insentive = joi_body_validation.value["insentive"];

    //add to database

    const pg_client = await pool.connect()
    let[success,result] = await addIncentive(pg_client,booking,insentive);
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.put('/update/:id',async (req,res)=>{
       
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
        console.log(iresult);
        pg_client.release();
        return;
    }

      //ID tidak ditemukan

      if(iresult.length === 0){ 
        console.log(iresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + incentive_id.toString(),
            "error_data": {
                "ON": "incentive_id_EXIST",
                "ID": incentive_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //send data to update

    let[success,result] = await updateIncentive(pg_client,incentive_id,booking,insentive);
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.delete('/delete/:id',async (req,res)=>{
           
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

    const incentive_id = req.params.id
    const pg_client = await pool.connect()

    
    //checking id

    let[isuccess,iresult] = await viewIncentivebyId(pg_client,incentive_id)
    if(!isuccess){
        console.log(iresult);
        pg_client.release();
        return;
    }

      //ID tidak ditemukan

      if(iresult.length === 0){ 
        console.log(iresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + incentive_id.toString(),
            "error_data": {
                "ON": "incentive_id_EXIST",
                "ID": incentive_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //send data to delete

    let[success,result] = await deleteIncentive(pg_client,incentive_id);
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})


module.exports = router