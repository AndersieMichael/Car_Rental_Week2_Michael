const express = require('express')
const joi = require('joi')
const router = express.Router()
const allMembership = require('./function').allMembership
const viewMembershipById = require('./function').viewMembershipById
const addMembership = require('./function').addMembership
const updateMembership = require('./function').updateMembership
const deleteMembership = require('./function').deleteMembership
const pool = require('./Database/connection').pool

router.get('/',async (req,res)=>{
    const pg_client = await pool.connect()
    let[success,result] = await allMembership(pg_client)
    if(!success){
        console.log(result);
        pg_client.release();
        res.status(200).json({"message":"Error","data":result})
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.get('/:id',async (req,res)=>{
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
         res.status(200).json(message);
         return; //END
     }
    const membership_id = req.params.id
    const pg_client = await pool.connect()
    let[success,result] = await viewMembershipById(pg_client,membership_id)
    if(!success){
        console.log(result);
        pg_client.release();
        res.status(200).json({"message":"Error","data":result})
        return;
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
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    
})

router.post('/add',async(req,res)=>{
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
        res.status(200).json(message);
        return; //END
    }
    let name = joi_body_validation.value["name"];
    let discount = joi_body_validation.value["discount"];
    
    const pg_client = await pool.connect()
    let[success,result] = await addMembership(pg_client,name,discount)
    if(!success){
        console.log(result);
        pg_client.release();
        res.status(200).json({"message":"Error","data":result})
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.put('/update/:id',async(req,res)=>{

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
        console.log(Mresult);
        pg_client.release();
        res.status(200).json({"message":"Error","data":Mresult})
        return;
    }

    //ID tidak ditemukan

    if(Mresult.length === 0){ 
        console.log(Mresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + membership_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": membership_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //send data to updated

    let[success,result] = await updateMembership(pg_client,membership_id,name,discount)
    if(!success){
        console.log(result);
        pg_client.release();
        res.status(200).json({"message":"Error","data":result})
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.delete('/delete/:id',async(req,res)=>{
      
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
        res.status(200).json(message);
        return; //END
    }

    const membership_id = req.params.id
    const pg_client = await pool.connect()

    //check if the id exist
    
    let[Msuccess,Mresult] = await viewMembershipById(pg_client,membership_id)
    if(!Msuccess){
        console.log(Mresult);
        pg_client.release();
        res.status(200).json({"message":"Error","data":Mresult})
        return;
    }

    //ID tidak ditemukan

    if(Mresult.length === 0){ 
        console.log(Mresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + membership_id.toString(),
            "error_data": {
                "ON": "checkBookIDExists",
                "ID": membership_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

  

    //delete membership

    let[success,result] = await deleteMembership(pg_client,membership_id)
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