const express = require('express')
const router = express.Router()

const allBooking = require('./function').allBooking
const viewBookingById =  require('./function').viewbookingById
const addBooking =  require('./function').addBooking
const updateBooking =  require('./function').updateBooking
const deleteBooking =  require('./function').deleteBooking

const carsById = require('./function').carsById

const getMembershipDiscount = require('./function').getMembershipDiscount

const getDriverPayment = require('./function').getDriverPayment

const addDriverIncentive = require('./function').addDriverIncentive
const updateDriverIncentive = require('./function').updateDriverIncentive
const deleteDriverIncentive = require('./function').deleteDriverIncentive
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
    const{custid,carid,startT,endT,status,booktypeid} = req.body
    let {driverid}= req.body
    const start = new Date(startT*1000);
    const end = new Date(endT*1000);
    const day = new Date(end - start).getDate()
    let discount,daily_discount,total,insentive =0
    const pg_client = await pool.connect()
    //get car id
    let[carsSuccess,carsResult] = await carsById(pg_client,carid)
    if(!carsSuccess){
        console.log(carsResult);
        pg_client.release();
        return;
    }
    //get membership
    let[membershipSuccess,membershipResult] = await getMembershipDiscount(pg_client,custid)
    if(!membershipSuccess){
        console.log(membershipResult);
        pg_client.release();
        return;
    }
    if(membershipResult.length === 0){
        daily_discount=0
    }
    else{
        daily_discount = membershipResult[0]["daily_discount"]
    }

    let harga = carsResult[0]["rent_price_daily"];
    const cost = harga * day;
    if(booktypeid!=1){
        if(driverid == null){//jika bookid==2 tp tidak driverID=null
            res.status(400).send("You must add Driver ID !!")
         }else{    //ambil data driver 
            let[driverPaymentSuccess,driverPaymentResult] = await getDriverPayment(pg_client,driverid)
            if(!driverPaymentSuccess){
                console.log(driverPaymentResult);
                pg_client.release();
                return;
            }
            let driverPayment =  driverPaymentResult[0]["daily_cost"];
            total = driverPayment * day
         }
       
        insentive = cost*5/100
    }else{
        driverid=null
        total = 0
    }
    discount = cost * daily_discount/100
    //finaly create the booking
    let[success,result] = await addBooking(pg_client,custid,carid,start,end,cost,status,discount,booktypeid,driverid,total);
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        if(booktypeid!=1){//create driver incentive if booktypeid == 2
            let booking_id = result[0]["booking_id"];
            let[driverIncentiveSuccess,driverIncentiveResult] = await addDriverIncentive(pg_client,booking_id,insentive);
            if(!driverIncentiveSuccess){
                console.log(driverIncentiveResult);
                pg_client.release();
                return;
            }else{
                pg_client.release();
                res.status(200).json({"message":"Success","data":driverIncentiveResult})
            }
        }else{
            pg_client.release();
            res.status(200).json({"message":"Success","data":result})
        }
    }
    

})

router.put('/update/:id',async(req,res)=>{
    const{id} = req.params
    const{custid,carid,startT,endT,status,booktypeid} = req.body
    let {driverid}= req.body
    const start = new Date(startT*1000);
    const end = new Date(endT*1000);
    const day = new Date(end - start).getDate()
    let discount,daily_discount,total,insentive =0
    const pg_client = await pool.connect()
    //get car id
    let[carsSuccess,carsResult] = await carsById(pg_client,carid)
    if(!carsSuccess){
        console.log(carsResult);
        pg_client.release();
        return;
    }
    //get membership
    let[membershipSuccess,membershipResult] = await getMembershipDiscount(pg_client,custid)
    if(!membershipSuccess){
        console.log(membershipResult);
        pg_client.release();
        return;
    }
    if(membershipResult.length === 0){
        daily_discount=0
    }
    else{
        daily_discount = membershipResult[0]["daily_discount"]
    }

    let harga = carsResult[0]["rent_price_daily"];
    const cost = harga * day;
    if(booktypeid!=1){
        if(driverid == null){//jika bookid==2 tp tidak driverID=null
            res.status(400).send("You must add Driver ID !!")
         }else{    //ambil data driver 
            let[driverPaymentSuccess,driverPaymentResult] = await getDriverPayment(pg_client,driverid)
            if(!driverPaymentSuccess){
                console.log(driverPaymentResult);
                pg_client.release();
                return;
            }
            let driverPayment =  driverPaymentResult[0]["daily_cost"];
            total = driverPayment * day
         }
       
        insentive = cost*5/100
    }else{
        driverid=null
        total = 0
    }
    discount = cost * daily_discount/100

    let[success,result] = await updateBooking(pg_client,Number(id),custid,carid,start,end,cost,status,discount,booktypeid,driverid,total)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{
        if(booktypeid!=1){//update driver incentive if booktypeid == 2
            let[driverIncentiveSuccess,driverIncentiveResult] = await updateDriverIncentive(pg_client,Number(id),insentive);
            if(!driverIncentiveSuccess){
                console.log(driverIncentiveResult);
                pg_client.release();
                return;
            }else{
                pg_client.release();
                res.status(200).json({"message":"Success","data":driverIncentiveResult})
            }
        }else{
            pg_client.release();
            res.status(200).json({"message":"Success","data":result})
        }
    }
})

router.delete('/delete/:id',async(req,res)=>{
    const{id} = req.params
    const pg_client = await pool.connect()
    let[driverIncentiveSuccess,driverIncentiveResult] = await deleteDriverIncentive(pg_client,Number(id));
            if(!driverIncentiveSuccess){
                console.log(driverIncentiveResult);
                pg_client.release();
                return;
            }else{
                let[success,result] = await deleteBooking(pg_client,Number(id))
                if(!success){
                    console.log(result);
                    pg_client.release();
                    return;
                }else{
                    pg_client.release();
                    res.status(200).json({"message":"Success","data":result})
                }
            }
    
})

module.exports = router