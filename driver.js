const express = require('express')
const router = express.Router()
const joi = require('joi')
const allDriver = require('./function').allDriver
const viewDriverbyId = require('./function').viewDriverById
const addDriver = require('./function').addDriver
const updateDriver = require('./function').updateDriver
const deleteDriver = require('./function').deleteDriver
const pool = require('./Database/connection').pool

router.get('/',async (req,res)=>{
    const pg_client = await pool.connect()
    let[success,result] = await allDriver(pg_client)
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

    //view driver By ID

    const driver_id = req.params.id
    const pg_client = await pool.connect()
    let[success,result] = await viewDriverbyId(pg_client,driver_id)
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
            "error_message": "Cant found data with id :: " + driver_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": driver_id
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
        console.log(dresult);
        pg_client.release();
        return;
    }

    //ID tidak ditemukan

    if(dresult.length === 0){ 
        console.log(dresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + driver_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": driver_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //send data to update

    let[success,result] = await updateDriver(pg_client,driver_id,name,nik,phone,cost)
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
    
    //make PG CLient
    const driver_id = req.params.id
    const pg_client = await pool.connect()

    //checking IF ID Exist

    let[dsuccess,dresult] = await viewDriverbyId(pg_client,driver_id)
    if(!dsuccess){
        console.log(dresult);
        pg_client.release();
        return;
    }

    //ID tidak ditemukan

    if(dresult.length === 0){ 
        console.log(dresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + driver_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": driver_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //Delete Data

    let[success,result] = await deleteDriver(pg_client,driver_id)
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