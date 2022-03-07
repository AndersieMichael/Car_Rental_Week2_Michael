const express = require('express')
const router = express.Router()

const allIncentive= require('./function').allIncentive
const viewIncentivebyId = require('./function').viewIncentiveById
const addIncentive = require('./function').addDriverIncentive
const updateIncentive = require('./function').updateIncentiveById
const deleteIncentive = require('./function').deleteIncentive
const pool = require('./Database/connection').pool


router.get('',async (req,res)=>{
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
    const{id} = req.params
    const pg_client = await pool.connect()
    let[success,result] = await viewIncentivebyId(pg_client,Number(id))
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
    const{booking,insentive} = req.body
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
    const{id} = req.params
    const{booking,insentive} = req.body
    const pg_client = await pool.connect()
    let[success,result] = await updateIncentive(pg_client,Number(id),booking,insentive);
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
    let[success,result] = await deleteIncentive(pg_client,Number(id));
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