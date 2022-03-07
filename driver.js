const express = require('express')
const router = express.Router()

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
    const{id} = req.params
    const pg_client = await pool.connect()
    let[success,result] = await viewDriverbyId(pg_client,Number(id))
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.post('/add',async (req,res)=>{
    const{name,nik,phone,cost} = req.body
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
    const{id} = req.params
    const{name,nik,phone,cost} = req.body
    const pg_client = await pool.connect()
    let[success,result] = await updateDriver(pg_client,Number(id),name,nik,phone,cost)
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
    const{id} = req.params
    const pg_client = await pool.connect()
    let[success,result] = await deleteDriver(pg_client,Number(id))
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