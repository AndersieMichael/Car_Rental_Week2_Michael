//booking function

const moment = require("moment")

/**
 * This function will get all booking
 * 
 * @param {*} pg_client pool connection 
 * @returns 
 */

async function getAllBooking(pg_client){
    let query
    let success
    let result

    try {
        query= `select * from booking
                order by booking_id`
        const temp = await pg_client.query(query)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}


/**
 * This function will get booking by booking id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id booking id 
 * @returns 
 */

async function getBookingById(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select * from booking
                where booking_id=$1`
        value=[
            id
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}


/**
 * get booking from customer id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id Customer id 
 * @returns 
 */

async function getBookingByCustomerId(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select * from booking
                where customer_id=$1`
        value=[
            id
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}


/**
 * add booking 
 * 
 * @param {*} pg_client pool connection 
 * @param {number} custid customer id
 * @param {number} carid cars id
 * @param {Date} startT start time already change to date
 * @param {Date} endT end time already change to date
 * @param {number} cost total cost (car payment * days)
 * @param {boolean} finish boolean finish or not 
 * @param {number} discount discount (total cost * discount from membership)
 * @param {number} booktypeid book type id
 * @param {number} driverid driver id
 * @param {number} total total driver cost (driver payment * days)
 * @returns 
 */

async function addBooking(pg_client,custid,carid,startT,endT,cost,finish,discount,booktypeid,driverid,total){
    let query
    let value
    let success
    let result

    try {
        query= `insert into booking (customer_id,cars_id,start_time,end_time,total_cost,finished,discount,booktype_id,driver_id,total_driver_cost)
                Values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                Returning booking_id`
        value=[
            custid,
            carid,
            startT,
            endT,
            cost,
            finish,
            discount,
            booktypeid,
            driverid,
            total
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}


/**
 * update booking from booking id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id booking id
 * @param {number} custid customer id
 * @param {number} carid cars id
 * @param {Date} startT start time already change to date
 * @param {Date} endT end time already change to date
 * @param {number} cost total cost (car payment * days)
 * @param {boolean} finish boolean finish or not 
 * @param {number} discount discount (total cost * discount from membership)
 * @param {number} booktypeid book type id
 * @param {number} driverid driver id
 * @param {number} total total driver cost (driver payment * days)
 * @returns 
 */

async function updateBooking(pg_client,id,custid,carid,startT,endT,cost,finish,discount,booktypeid,driverid,total){
    let query
    let value
    let success
    let result

    try {
        query= `update booking
                set "customer_id" = $2,
                "cars_id" = $3,
                "start_time"=$4,
                "end_time"=$5,
                "total_cost"=$6,
                "finished"=$7,
                "discount"=$8,
                "booktype_id"=$9,
                "driver_id"=$10,
                "total_driver_cost"=$11
                where booking_id=$1`
        value=[
            id,
            custid,
            carid,
            startT,
            endT,
            cost,
            finish,
            discount,
            booktypeid,
            driverid,
            total
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}


/**
 * delete booking from booking id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id booking id
 * @returns 
 */

async function deleteBooking(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `delete from booking
                where booking_id=$1`
        value=[
            id
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}

/**
 * update driver incentive from booking id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} bookid booking id
 * @param {number} price incentive (total cost from booking * 5/100)
 * @returns 
 */

async function updateDriverIncentiveByBookingId(pg_client,bookid,price){
    let query
    let value
    let success
    let result

    try {
        query= `update driver_incentive
                set "incentive" = $2
                where booking_id=$1`
        value=[
            bookid,
            price
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}

/**
 * delete driver incentive by booking id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id booking id 
 * @returns 
 */

async function deleteDriverIncentiveFromBookId(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `delete from driver_incentive
                where booking_id=$1`
        value=[
            id
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}

/**
 * get membership from customer id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id customer id
 * @returns 
 */

async function getMembershipByCustomerID(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select daily_discount 
                from membership m 
                inner join customer c on m.membership_id =c.membership_id 
                where customer_id = $1`
        value=[
            id
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}

/**
 * get driver daily cost from driver id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id  driver id
 * @returns 
 */

async function getDriverPayment(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select daily_cost 
                from driver d  
                where driver_id =$1`
        value=[
            id
        ]
        const temp = await pg_client.query(query,value)
        if(temp==null || temp==undefined){
            throw new Error(`query Resulted on: ${temp}`)
        }else{
            result= temp.rows
            success = true
        }
    } catch (error) {
        console.log(error.message);
        success=false;
        result=err.message;
    }
    return[success,result]
}

/**
 * changging date to unix times
 * 
 * @param {object} result booking data from json 
 * @returns 
 */

function changeDateToUnix(result){
    for(var i in result){
        result[i]["start_time"] = moment(result[i]["start_time"]).unix();
        result[i]["end_time"] = moment(result[i]["end_time"]).unix();
    }
    return result
}


exports.allBooking = getAllBooking
exports.viewbookingById = getBookingById
exports.addBooking = addBooking
exports.updateBooking = updateBooking
exports.deleteBooking = deleteBooking
exports.viewbookingbyCustomerId = getBookingByCustomerId
exports.updateDriverIncentive = updateDriverIncentiveByBookingId
exports.deleteDriverIncentive = deleteDriverIncentiveFromBookId

exports.getMembershipDiscount = getMembershipByCustomerID

exports.getDriverPayment = getDriverPayment

exports.convertToUnix = changeDateToUnix