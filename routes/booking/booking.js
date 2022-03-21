//IMPORT

const express = require('express')
const router = express.Router()
const joi = require('joi')
const moment = require("moment")

//FUNCTION

const allBooking = require('./functions').allBooking
const viewBookingById =  require('./functions').viewbookingById
const addBooking =  require('./functions').addBooking
const updateBooking =  require('./functions').updateBooking
const deleteBooking =  require('./functions').deleteBooking
const viewbookingbyCustomerId = require('./functions').viewbookingbyCustomerId

const carsById = require('../car/functions').carsById

const getMembershipDiscount = require('./functions').getMembershipDiscount

const getDriverPayment = require('./functions').getDriverPayment

const changeDateToUnix = require('./functions').convertToUnix

const addDriverIncentive = require('../driverIncentive/functions').addDriverIncentive
const updateDriverIncentive = require('./functions').updateDriverIncentive
const deleteDriverIncentive = require('./functions').deleteDriverIncentive

//logging
const logApiBasic = require('../../utilities/slack').logApiBasic;

//Connection 

const pool = require('../../utilities/connection').pool

//middleware

const middleware = require('../../middleware/middleware').customerMiddlware

let head_route_name = "/booking"

//view all booking

router.get('/',async (req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    const pg_client = await pool.connect()

    //function all booking

    let[success,result] = await allBooking(pg_client)

    //fail

    if(!success){
        
        //error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewAllBooking"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return; //end
    }

    //success

    pg_client.release();
    let view =  changeDateToUnix(result)
    res.status(200).json({"message":"Success","data":view})
    return; //end

})

//view booking by bookingID

router.get('/view/:id',async(req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())
            
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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        res.status(200).json(message);
        return; //END
    }

    const booking_id = req.params.id

    const pg_client = await pool.connect()

    //function view booking 

    let[success,result] = await viewBookingById(pg_client,booking_id)
    if(!success){
        
        //error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewBookingByID"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return; //END
    }
      //ID tidak ditemukan

      if(result.length === 0){ 
        
        //error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + booking_id.toString(),
            "error_data": {
                "ON": "booking_id_EXIST",
                "ID": booking_id
            }
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }
    //success
    pg_client.release();
    let view =  changeDateToUnix(result)
    res.status(200).json({"message":"Success","data":view})
    return; //END

})

//add bookingID

router.post('/add',async(req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
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
        
        //error
        
        console.error(carsResult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": carsResult,
            "error_data": "ON checkingCar"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }
    
    //get membership 
    
    let[membershipSuccess,membershipResult] = await getMembershipDiscount(pg_client,custid)
    if(!membershipSuccess){
        
        //error
        
        console.error(membershipResult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": membershipResult,
            "error_data": "ON checkingMembership"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return; //END
        
    }

    //get daily discount from membership

    daily_discount = membershipResult[0]["daily_discount"]

    //get rent price daily from car

    let harga = carsResult[0]["rent_price_daily"];

    //calculate total cost

    const cost = harga * day;
    
    //checking booking type id 

    if(booktypeid!=1){
        
        //jika bookid==2 tp driverID=null

        if(driverid == null){
            
            //error
            
            console.error("DriverID_NULL");
            const message = {
                "message": "Failed",
                "error_key": "error_driver_null",
                "error_message": "DriverID_NULL",
                "error_data": "ON checkingDriver_if_bookType2"
            };
            //LOGGING
            logApiBasic( 
                `Request ${head_route_name}${request_namepath} Failed`,
                `REQUEST GOT AT : ${time_requested} \n` +
                "REQUEST BODY/PARAM : \n" +
                JSON.stringify('', null, 2),
                JSON.stringify(message, null, 2)
            );
            pg_client.release();
            res.status(200).json(message)
            return; //END
        }
        
        else{    
            
            //ambil data driver 
            
            let[driverPaymentSuccess,driverPaymentResult] = await getDriverPayment(pg_client,driverid)
            if(!driverPaymentSuccess){
                
                //error
                
                console.error(driverPaymentResult);
                const message = {
                    "message": "Failed",
                    "error_key": "error_internal_server",
                    "error_message": driverPaymentResult,
                    "error_data": "ON getDriverPayment"
                };
                //LOGGING
                logApiBasic( 
                    `Request ${head_route_name}${request_namepath} Failed`,
                    `REQUEST GOT AT : ${time_requested} \n` +
                    "REQUEST BODY/PARAM : \n" +
                    JSON.stringify('', null, 2),
                    JSON.stringify(message, null, 2)
                );
                pg_client.release();
                res.status(200).json(message)
                return; //END
            }

            //get driver payment 

            let driverPayment =  driverPaymentResult[0]["daily_cost"];

            //calculate total driver cost

            total = driverPayment * day
        }
       
        //caculate insentive

        insentive = cost*5/100

    }else{

        driverid=null
        total = 0
    }

    //calculate discount from total cost * daily discount

    discount = cost * daily_discount

    //create booking
    
    let[success,result] = await addBooking(pg_client,custid,carid,start,end,cost,status,discount,booktypeid,driverid,total);
    if(!success){
        
        //error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON addBooking"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }else{

        //create driver incentive if booktypeid == 2
        
        if(booktypeid!=1){
            let booking_id = result[0]["booking_id"];
            let[driverIncentiveSuccess,driverIncentiveResult] = await addDriverIncentive(pg_client,booking_id,insentive);
            if(!driverIncentiveSuccess){
                
                //error
                
                console.error(driverIncentiveResult);
                const message = {
                    "message": "Failed",
                    "error_key": "error_internal_server",
                    "error_message": driverIncentiveResult,
                    "error_data": "ON addDriverIncentiveFromBooking"
                };
                //LOGGING
                logApiBasic( 
                    `Request ${head_route_name}${request_namepath} Failed`,
                    `REQUEST GOT AT : ${time_requested} \n` +
                    "REQUEST BODY/PARAM : \n" +
                    JSON.stringify('', null, 2),
                    JSON.stringify(message, null, 2)
                );
                pg_client.release();
                res.status(200).json(message)
                return; //END
            }
            
            //success

            pg_client.release();
            res.status(200).json({"message":"Success","data":driverIncentiveResult})
            return; //END

        }

        //success

        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
        return; //END

    }
    

})

//update booking from bookingID

router.put('/update/:id',async(req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())
            
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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
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

    //calculate date range

    const start = new Date(startT*1000);
    const end = new Date(endT*1000);
    const day = new Date(end - start).getDate()

    let discount,daily_discount,total,insentive =0

    const pg_client = await pool.connect()

    //checking if id exist
    
    let[bsuccess,bresult] = await viewBookingById(pg_client,booking_id)

    //fail
    
    if(!bsuccess){
        
        //error
        
        console.error(bresult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": bresult,
            "error_data": "ON checkingBookingID"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return; //END
    }
      //ID tidak ditemukan

      if(bresult.length === 0){ 
        
        //error
        
        console.error(bresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + booking_id.toString(),
            "error_data": {
                "ON": "booking_id_EXIST",
                "ID": booking_id
            }
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    let checkBookType = bresult[0]["booktype_id"]

    //checking id booktypeid change

    if(checkBookType!=booktypeid){
        
        //error
        
        console.error("check book deference!!!");
        const message = {
            "message": "Failed",
            "error_key": "error_booktype_id_change",
            "error_message": "booktypeID cannot be change",
            "error_data": "ON checkingbookTypeID"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return; //END

    }

    //get car id

    let[carsSuccess,carsResult] = await carsById(pg_client,carid)

    //fail

    if(!carsSuccess){
        
        //error
        
        console.error(carsResult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": carsResult,
            "error_data": "ON checkingCarID"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return; //END
    }

    //get membership

    let[membershipSuccess,membershipResult] = await getMembershipDiscount(pg_client,custid)

    //fail

    if(!membershipSuccess){
        
        //error
        
        console.error(membershipResult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": membershipResult,
            "error_data": "ON checkingMembership"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return; //END
    }

    //get daily discount from membership

    daily_discount = membershipResult[0]["daily_discount"]
    
    //get rent price daily

    let harga = carsResult[0]["rent_price_daily"];

    //calculate cost

    const cost = harga * day;

    //checking booktype for calucating driver cost
    
    if(booktypeid!=1){
        
        //jika bookid==2 tp driverID=null

        if(driverid == null){
            
            //error
            
            console.error("DriverID_NULL");
            const message = {
                "message": "Failed",
                "error_key": "error_driver_null",
                "error_message": "DriverID_NULL",
                "error_data": "ON checkingDriver_if_bookType2"
            };
            //LOGGING
            logApiBasic( 
                `Request ${head_route_name}${request_namepath} Failed`,
                `REQUEST GOT AT : ${time_requested} \n` +
                "REQUEST BODY/PARAM : \n" +
                JSON.stringify('', null, 2),
                JSON.stringify(message, null, 2)
            );
            pg_client.release();
            res.status(200).json(message)
            return; //END

        }else{    
            
            //ambil data driver 
            
            let[driverPaymentSuccess,driverPaymentResult] = await getDriverPayment(pg_client,driverid)
            if(!driverPaymentSuccess){
                
                //error
                
                console.error(driverPaymentResult);
                const message = {
                    "message": "Failed",
                    "error_key": "error_internal_server",
                    "error_message": driverPaymentResult,
                    "error_data": "ON checkingDriverPaymentOnBooking"
                };
                //LOGGING
                logApiBasic( 
                    `Request ${head_route_name}${request_namepath} Failed`,
                    `REQUEST GOT AT : ${time_requested} \n` +
                    "REQUEST BODY/PARAM : \n" +
                    JSON.stringify('', null, 2),
                    JSON.stringify(message, null, 2)
                );
                pg_client.release();
                res.status(200).json(message)
                return; //END

            }

            //get driver payment

            let driverPayment =  driverPaymentResult[0]["daily_cost"];
            
            //calculate total driver cost 

            total = driverPayment * day
        }
        
        //calcluate insentive

        insentive = cost*5/100

    }else{
        driverid=null
        total = 0
    }

    //get discount

    discount = cost * daily_discount

    //update booking

    let[success,result] = await updateBooking(pg_client,booking_id,custid,carid,start,end,cost,status,discount,booktypeid,driverid,total)
    if(!success){
        
        //error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON updateBooking"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return; //END
    }else{

        //update driver incentive if booktypeid == 2
        
        if(booktypeid!=1){
            let[driverIncentiveSuccess,driverIncentiveResult] = await updateDriverIncentive(pg_client,booking_id,insentive);
            if(!driverIncentiveSuccess){
                
                //error
                
                console.error(driverIncentiveResult);
                const message = {
                    "message": "Failed",
                    "error_key": "error_internal_server",
                    "error_message": driverIncentiveResult,
                    "error_data": "ON updateDriverIncentiveOnBooking"
                };
                //LOGGING
                logApiBasic( 
                    `Request ${head_route_name}${request_namepath} Failed`,
                    `REQUEST GOT AT : ${time_requested} \n` +
                    "REQUEST BODY/PARAM : \n" +
                    JSON.stringify('', null, 2),
                    JSON.stringify(message, null, 2)
                );
                pg_client.release();
                res.status(200).json(message)
                return; //END
            }
            
            //success

            pg_client.release();
            res.status(200).json({"message":"Success","data":driverIncentiveResult})
            return; //END

        }

        //success

        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
        return; //END

    }
})

//delete booking by booking id

router.delete('/delete/:id',async(req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())
            
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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        res.status(200).json(message);
        return; //END
    }

    const booking_id = req.params.id
    const pg_client = await pool.connect()

    //checking if id exist
    
    let[bsuccess,bresult] = await viewBookingById(pg_client,booking_id)
    if(!bsuccess){
        
        //error
        
        console.error(bresult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": bresult,
            "error_data": "ON checkingBooking"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }
      //ID tidak ditemukan

      if(bresult.length === 0){ 
        
        //error
        
        console.error(bresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + booking_id.toString(),
            "error_data": {
                "ON": "booking_id_EXIST",
                "ID": booking_id
            }
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //delete driver incentive terlebih dahulu sebelum booking

    let[driverIncentiveSuccess,driverIncentiveResult] = await deleteDriverIncentive(pg_client,booking_id);

    if(!driverIncentiveSuccess){
        
        //error
        
        console.error(driverIncentiveResult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": driverIncentiveResult,
            "error_data": "ON deleteDriverIncentiveOnBooking"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;

    }else{
            
        //delete booking

        let[success,result] = await deleteBooking(pg_client,booking_id)
        if(!success){
            
            //error
            
            console.error(result);
            const message = {
                "message": "Failed",
                "error_key": "error_internal_server",
                "error_message": result,
                "error_data": "ON deleteBooking"
            };
            //LOGGING
            logApiBasic( 
                `Request ${head_route_name}${request_namepath} Failed`,
                `REQUEST GOT AT : ${time_requested} \n` +
                "REQUEST BODY/PARAM : \n" +
                JSON.stringify('', null, 2),
                JSON.stringify(message, null, 2)
            );
            pg_client.release();
            res.status(200).json(message)
            return;
        }

        //success

        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
        return;
    }
    
})

//view booking by middleware

router.get('/viewBooking/byMiddleware',middleware,async(req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())

    //get id from middleware

    let cust_id = res.locals.curr_customer_id;
    
    const pg_client = await pool.connect()

    //view booking from customer ID

    let[success,result] = await viewbookingbyCustomerId(pg_client,cust_id)
    if(!success){
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": result,
            "error_data": "ON viewbookingByMiddleware"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }
      //ID tidak ditemukan
      
    if(result.length === 0){ 
        
        //error
        
        console.error(result);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with customer id :: " + cust_id.toString(),
            "error_data": {
                "ON": "Booking_EXIST",
                "ID": cust_id
            }
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    //success
        
    pg_client.release();
    let view =  changeDateToUnix(result)
    res.status(200).json({"message":"Success","data":view})
    return; //END
    
})

//delete booking by booking id and checking by middleware

router.delete('/delete/fromMiddleware/:id',middleware,async(req,res)=>{

    //Basic Info
    
    let request_namepath = req.path
    let time_requested = moment(Date.now())
            
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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        res.status(200).json(message);
        return; //END
    }

    const booking_id = req.params.id
    let cust_id = res.locals.curr_customer_id;

    const pg_client = await pool.connect()

    //checking if id exist
    
    let[bsuccess,bresult] = await viewBookingById(pg_client,booking_id)
    if(!bsuccess){
        
        //error
        
        console.error(bresult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": bresult,
            "error_data": "ON checkingBookingFromMiddleware"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return;
    }
    //ID tidak ditemukan

    if(bresult.length === 0){ 
        
        //error
        
        console.error(bresult);
        const message = {
            "message": "Failed",
            "error_key": "error_id_not_found",
            "error_message": "Cant found data with id :: " + booking_id.toString(),
            "error_data": {
                "ON": "booking_id_EXIST",
                "ID": booking_id
            }
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
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
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message);
        return; //END
    }

    // delete driver incentive terlebih dahulu sebelum booking

    let[driverIncentiveSuccess,driverIncentiveResult] = await deleteDriverIncentive(pg_client,booking_id);
    if(!driverIncentiveSuccess){
        
        //error
        
        console.error(driverIncentiveResult);
        const message = {
            "message": "Failed",
            "error_key": "error_internal_server",
            "error_message": driverIncentiveResult,
            "error_data": "ON deleteDriverIncentiveOnBookingFromMiddleware"
        };
        //LOGGING
        logApiBasic( 
            `Request ${head_route_name}${request_namepath} Failed`,
            `REQUEST GOT AT : ${time_requested} \n` +
            "REQUEST BODY/PARAM : \n" +
            JSON.stringify('', null, 2),
            JSON.stringify(message, null, 2)
        );
        pg_client.release();
        res.status(200).json(message)
        return; //END
    }else{

        //delete booking
                
        let[success,result] = await deleteBooking(pg_client,booking_id)
        if(!success){
            
            //error
            
            console.error(result);
            const message = {
                "message": "Failed",
                "error_key": "error_internal_server",
                "error_message": result,
                "error_data": "ON deleteBookingFromMiddleware"
            };
            //LOGGING
            logApiBasic( 
                `Request ${head_route_name}${request_namepath} Failed`,
                `REQUEST GOT AT : ${time_requested} \n` +
                "REQUEST BODY/PARAM : \n" +
                JSON.stringify('', null, 2),
                JSON.stringify(message, null, 2)
            );
            pg_client.release();
            res.status(200).json(message)
            return; //END
        }
        
        //success
        
        pg_client.release();
        res.status(200).json({"message":"Success","data":result})
        return; //END

    }
    
})

module.exports = router