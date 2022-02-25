const express = require('express')
const router = express.Router()

const allCustomer = require('./function').allCustomer
const customerById = require('./function').customerById
const addCustomer = require('./function').addCustomer
const deleteCustomer = require('./function').deleteCustomer
const updateCustomer = require('./function').updateCustomer
const pool = require('./Database/connection').pool


router.get('/',async (req,res)=>{
    // res.send('View Customer Page');
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
    const{id} = req.params
    // res.send(`View Customer Page By ${id}`);
    const pg_client = await pool.connect()
    let[success,result] = await customerById(pg_client,Number(id))
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.post('/add',async(req,res)=>{
    // res.send('Add Customer Page');
    const{name,nik,phone} = req.body
    const pg_client = await pool.connect()
    let[success,result] = await addCustomer(pg_client,name,nik,phone)
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
    const{id} = req.params
    // res.send(`Update Customer Page by ${id}`);
    const{name,nik,phone} = req.body
    const pg_client = await pool.connect()
    let[success,result] = await updateCustomer(pg_client,Number(id),name,nik,phone)
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
    const{id} = req.params
    // res.send(`Delete Customer Page by ${id}`);
    const pg_client = await pool.connect()
    let[success,result] = await deleteCustomer(pg_client,Number(id))
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