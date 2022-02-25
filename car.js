const express = require('express')
const router = express.Router()

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
    const{id} = req.params
    const pg_client = await pool.connect()
    let[success,result] = await carsById(pg_client,Number(id))
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
    const{name,price,stock} = req.body
    const pg_client = await pool.connect()
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
    const{id} = req.params
    const{name,price,stock} = req.body
    const pg_client = await pool.connect()
    let[success,result] = await updatecar(pg_client,Number(id),name,price,stock)
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
    let[success,result] = await deletecar(pg_client,Number(id))
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