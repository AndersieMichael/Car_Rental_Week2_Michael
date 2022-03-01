const express = require('express')
const router = express.Router()

const allBooking = require('./function').allBooking
const viewBookingById =  require('./function').viewbookingById
const addBooking =  require('./function').addBooking
const updateBooking =  require('./function').updateBooking
const deleteBooking =  require('./function').deleteBooking
const pool = require('./Database/connection').pool

const changeDateToUnix = require('./function').convertToUnix

router.get('/',async (req,res)=>{
    const pg_client = await pool.connect()
    let[success,result] = await allBooking(pg_client)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
       let view =  changeDateToUnix(result)
        res.status(200).json({"message":"Success","data":view})
    }
})

router.get('/:id',async(req,res)=>{
    const{id} = req.params
    const pg_client = await pool.connect()
    let[success,result] = await viewBookingById(pg_client,Number(id))
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        pg_client.release();
        let view =  changeDateToUnix(result)
        res.status(200).json({"message":"Success","data":view})
    }
})

router.post('/add',async(req,res)=>{
    const{custid,carid,startT,endT,cost,status} = req.body
    const start = new Date(startT*1000);
    const end = new Date(endT*1000);
    // console.log(start);
    const pg_client = await pool.connect()
    let[success,result] = await addBooking(pg_client,custid,carid,start,end,cost,status)
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
    const{custid,carid,startT,endT,cost,status} = req.body
    const start = new Date(startT*1000);
    const end = new Date(endT*1000);
    const pg_client = await pool.connect()
    let[success,result] = await updateBooking(pg_client,Number(id),custid,carid,start,end,cost,status)
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
    let[success,result] = await deleteBooking(pg_client,Number(id))
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