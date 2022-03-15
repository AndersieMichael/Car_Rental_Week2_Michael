const express = require('express')
const router = express.Router()
const joi = require('joi')
const allBooking = require('./function').allBooking
const viewBookingById =  require('./function').viewbookingById
const addBooking =  require('./function').addBooking
const updateBooking =  require('./function').updateBooking
const deleteBooking =  require('./function').deleteBooking
const viewbookingbyCustomerId = require('./function').viewbookingbyCustomerId

const carsById = require('./function').carsById

const getMembershipDiscount = require('./function').getMembershipDiscount

const getDriverPayment = require('./function').getDriverPayment

const addDriverIncentive = require('./function').addDriverIncentive
const updateDriverIncentive = require('./function').updateDriverIncentive
const deleteDriverIncentive = require('./function').deleteDriverIncentive
const pool = require('./Database/connection').pool

const changeDateToUnix = require('./function').convertToUnix

const middleware = require('./middleware').customerMiddlware

//view all booking

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

//view booking by bookingID

router.get('/view/:id',async(req,res)=>{
            
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

    const booking_id = req.params.id

    const pg_client = await pool.connect()
    let[success,result] = await viewBookingById(pg_client,booking_id)
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
            "error_message": "Cant found data with id :: " + booking_id.toString(),
            "error_data": {
                "ON": "booking_id_EXIST",
                "ID": booking_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

        pg_client.release();
        let view =  changeDateToUnix(result)
        res.status(200).json({"message":"Success","data":view})

})

//add bookingID

router.post('/add',async(req,res)=>{

    //validation the body
    
    let joi_template_body = joi.object({
        "custid": joi.number().required(),
        "carid": joi.number().required(),
        "startT": joi.number().required(),
        "endT": joi.number().required(),
        "status": joi.bool().required(),
        "booktypeid": joi.number().required(),
        "driverid": joi.required(),
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
    let custid = joi_body_validation.value["custid"];
    let carid = joi_body_validation.value["carid"];
    let startT = joi_body_validation.value["startT"];
    let endT = joi_body_validation.value["endT"];
    let status = joi_body_validation.value["status"];
    let booktypeid = joi_body_validation.value["booktypeid"];
    let driverid = joi_body_validation.value["driverid"];
    let discount,daily_discount,total,insentive =0
    
    //calculate length date

    const start = new Date(startT*1000);
    const end = new Date(endT*1000);
    const day = new Date(end - start).getDate()
    
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

    //membership null

    if(membershipResult.length === 0){
        daily_discount=0
    }
    else{
        daily_discount = membershipResult[0]["daily_discount"]
    }

    let harga = carsResult[0]["rent_price_daily"];

    const cost = harga * day;
    
    //checking booking type id 

    if(booktypeid!=1){
        
        //jika bookid==2 tp driverID=null

        if(driverid == null){
            res.status(400).send("You must add Driver ID !!")
            return
        }
        
        else{    //ambil data driver 
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

    //create booking
    
    let[success,result] = await addBooking(pg_client,custid,carid,start,end,cost,status,discount,booktypeid,driverid,total);
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{

        //create driver incentive if booktypeid == 2
        
        if(booktypeid!=1){
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

//update booking from bookingID

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
        "custid": joi.number().required(),
        "carid": joi.number().required(),
        "startT": joi.number().required(),
        "endT": joi.number().required(),
        "status": joi.bool().required(),
        "booktypeid": joi.number().required(),
        "driverid": joi.required(),
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
    let custid = joi_body_validation.value["custid"];
    let carid = joi_body_validation.value["carid"];
    let startT = joi_body_validation.value["startT"];
    let endT = joi_body_validation.value["endT"];
    let status = joi_body_validation.value["status"];
    let booktypeid = joi_body_validation.value["booktypeid"];
    let driverid = joi_body_validation.value["driverid"];

    const booking_id = req.params.id
    const start = new Date(startT*1000);
    const end = new Date(endT*1000);
    const day = new Date(end - start).getDate()
    let discount,daily_discount,total,insentive =0

    const pg_client = await pool.connect()

    //checking if id exist
    
    let[bsuccess,bresult] = await viewBookingById(pg_client,booking_id)
    if(!bsuccess){
        console.log(bresult);
        pg_client.release();
        return;
    }
      //ID tidak ditemukan

      if(bresult.length === 0){ 
        console.log(bresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + booking_id.toString(),
            "error_data": {
                "ON": "booking_id_EXIST",
                "ID": booking_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

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

    //checking booktype for calucating driver cost
    
    if(booktypeid!=1){
        
        //jika bookid==2 tp driverID=null

        if(driverid == null){
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

    //get discount

    discount = cost * daily_discount/100

    //update booking

    let[success,result] = await updateBooking(pg_client,booking_id,custid,carid,start,end,cost,status,discount,booktypeid,driverid,total)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }else{

        //update driver incentive if booktypeid == 2
        
        if(booktypeid!=1){
            let[driverIncentiveSuccess,driverIncentiveResult] = await updateDriverIncentive(pg_client,booking_id,insentive);
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

//delete booking by booking id

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

    const booking_id = req.params.id
    const pg_client = await pool.connect()

    //checking if id exist
    
    let[bsuccess,bresult] = await viewBookingById(pg_client,booking_id)
    if(!bsuccess){
        console.log(bresult);
        pg_client.release();
        return;
    }
      //ID tidak ditemukan

      if(bresult.length === 0){ 
        console.log(bresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + booking_id.toString(),
            "error_data": {
                "ON": "booking_id_EXIST",
                "ID": booking_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //delete driver incentive terlebih dahulu sebelum booking

    let[driverIncentiveSuccess,driverIncentiveResult] = await deleteDriverIncentive(pg_client,booking_id);
            if(!driverIncentiveSuccess){
                console.log(driverIncentiveResult);
                pg_client.release();
                return;
            }else{
                //delete booking
                let[success,result] = await deleteBooking(pg_client,booking_id)
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

//view booking by middleware

router.get('/viewBooking/byMiddleware',middleware,async(req,res)=>{
    //get id from middleware

    let cust_id = res.locals.curr_customer_id;
    
    const pg_client = await pool.connect()
    let[success,result] = await viewbookingbyCustomerId(pg_client,cust_id)
    if(!success){
        console.log(result);
        pg_client.release();
        return;
    }
      //ID tidak ditemukan
      
      if(result.length === 0){ 
          console.log("this is Result:" + result);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with customer id :: " + cust_id.toString(),
            "error_data": {
                "ON": "cust_id_EXIST",
                "ID": cust_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

        pg_client.release();
        let view =  changeDateToUnix(result)
        res.status(200).json({"message":"Success","data":view})

})

//delete booking by booking id and checking by middleware

router.delete('/delete/fromMiddleware/:id',middleware,async(req,res)=>{
            
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

    const booking_id = req.params.id
    let cust_id = res.locals.curr_customer_id;
    const pg_client = await pool.connect()

    //checking if id exist
    
    let[bsuccess,bresult] = await viewBookingById(pg_client,booking_id)
    if(!bsuccess){
        console.log(bresult);
        pg_client.release();
        return;
    }
      //ID tidak ditemukan

      if(bresult.length === 0){ 
        console.log(bresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + booking_id.toString(),
            "error_data": {
                "ON": "booking_id_EXIST",
                "ID": booking_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }
    
    //checking if the customer is the one have the booking

    if(cust_id != bresult[0]["customer_id"]){
        const message = {
            "message": "Failed",
            "error_key": "error_delete",
            "error_message": "the Booking id::" + booking_id.toString() +" is not yours",
            "error_data": {
                "ON": "Cannot_delete_booking",
                "ID": booking_id
            }
        };
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    // delete driver incentive terlebih dahulu sebelum booking

    let[driverIncentiveSuccess,driverIncentiveResult] = await deleteDriverIncentive(pg_client,booking_id);
            if(!driverIncentiveSuccess){
                console.log(driverIncentiveResult);
                pg_client.release();
                return;
            }else{
                //delete booking
                let[success,result] = await deleteBooking(pg_client,booking_id)
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