//IMPORT
const express = require('express')
const router = express.Router()
const joi = require('joi')
const moment = require("moment")

//FUNCTION

const allcars = require('./functions').allcars
const carsById = require('./functions').carsById
const addcar = require('./functions').addcar
const updatecar = require('./functions').updateCar
const deletecar = require('./functions').deletecar
const pool = require('../../utilities/connection').pool

//logging
const logApiBasic = require('../../utilities/slack').logApiBasic;

let head_route_name = "/car"

//view all cars data

router.get('/',async (req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    const pg_client = await pool.connect()
    let[success,result] = await allcars(pg_client)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewAllCar"
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

//view all cars by cars id

router.get('/view/:id',async(req,res)=>{
    
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

    const cars_id = req.params.id
    const pg_client = await pool.connect()


    //view cars by ID

    let[success,result] = await carsById(pg_client,cars_id)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewCarByID"
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
            "error_message": "Cant found data with id :: " + cars_id.toString(),
            "error_data": {
                "ON": "cars_id_EXIST",
                "ID": cars_id
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

//add new car

router.post('/add',async(req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    //validation the body
    
    let joi_template_body = joi.object({
        "name": joi.string().required(),
        "price": joi.number().required(),
        "stock": joi.number().required(),
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
    let price = joi_body_validation.value["price"];
    let stock = joi_body_validation.value["stock"];

    const pg_client = await pool.connect()

    //Add car

    let[success,result] = await addcar(pg_client,name,price,stock)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON deleteCar"
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

//update car by cars id

router.put('/update/:id',async(req,res)=>{
    
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
        "price": joi.number().required(),
        "stock": joi.number().required(),
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
    let price = joi_body_validation.value["price"];
    let stock = joi_body_validation.value["stock"];    

    const cars_id = req.params.id

    const pg_client = await pool.connect()

    //checking id

    let[csuccess,cresult] = await carsById(pg_client,cars_id)
    if(!csuccess){
        
        //Error
        
        console.error(cresult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": cresult,
            "error_data": "ON checkingCarByID"
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

    if(cresult.length === 0){ 
        
        //Error
        
        console.error(cresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + cars_id.toString(),
            "error_data": {
                "ON": "cars_id_EXIST",
                "ID": cars_id
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

    let[success,result] = await updatecar(pg_client,cars_id,name,price,stock)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON updateCar"
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

//delete car by cars id

router.delete('/delete/:id',async(req,res)=>{
    
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

    const cars_id = req.params.id
    const pg_client = await pool.connect()

    
    //checking id

    let[csuccess,cresult] = await carsById(pg_client,cars_id)
    if(!csuccess){
        
        //Error
        
        console.error(cresult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": cresult,
            "error_data": "ON checkingCarByID"
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

    if(cresult.length === 0){ 
        
        //Error
        
        console.error(cresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + cars_id.toString(),
            "error_data": {
                "ON": "cars_id_EXIST",
                "ID": cars_id
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

    let[success,result] = await deletecar(pg_client,cars_id)
    if(!success){
        
        //Error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON deleteCar"
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