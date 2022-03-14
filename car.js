const express = require('express')
const router = express.Router()
const joi = require('joi')
const allcars = require('./function').allcars
const carsById = require('./function').carsById
const addcar = require('./function').addcar
const updatecar = require('./function').updateCar
const deletecar = require('./function').deletecar
const pool = require('./Database/connection').pool

router.get('/',async (req,res)=>{
    const pg_client = await pool.connect()
    let[success,result] = await allcars(pg_client)
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

    const cars_id = req.params.id
    const pg_client = await pool.connect()


    //view cars by ID

    let[success,result] = await carsById(pg_client,cars_id)
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
            "error_message": "Cant found data with id :: " + cars_id.toString(),
            "error_data": {
                "ON": "cars_id_EXIST",
                "ID": cars_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

        pg_client.release();
        res.status(200).json({"message":"Success","data":result})

})

router.post('/add/newcar',async(req,res)=>{

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
            "error_message": "Cant found data with id :: " + cars_id.toString(),
            "error_data": {
                "ON": "cars_id_EXIST",
                "ID": cars_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

   //send data to update

    let[success,result] = await updatecar(pg_client,cars_id,name,price,stock)
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

    const cars_id = req.params.id
    const pg_client = await pool.connect()

    
    //checking id

    let[csuccess,cresult] = await carsById(pg_client,cars_id)
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
            "error_message": "Cant found data with id :: " + cars_id.toString(),
            "error_data": {
                "ON": "cars_id_EXIST",
                "ID": cars_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }
    
    //send data to delete

    let[success,result] = await deletecar(pg_client,cars_id)
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