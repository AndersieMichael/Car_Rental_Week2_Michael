const express = require('express')
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
        return;
    }else{
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
    }
})

router.get('/:id',async (req,res)=>{
    const{id} = req.params
    const pg_client = await pool.connect()
    let[success,result] = await viewMembershipById(pg_client,Number(id))
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
    const{name,discount} = req.body
    const pg_client = await pool.connect()
    let[success,result] = await addMembership(pg_client,name,discount)
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
    const{name,discount} = req.body
    const pg_client = await pool.connect()
    let[success,result] = await updateMembership(pg_client,Number(id),name,discount)
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
    const pg_client = await pool.connect()
    let[success,result] = await deleteMembership(pg_client,Number(id))
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