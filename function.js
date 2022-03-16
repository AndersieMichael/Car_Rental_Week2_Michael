const moment = require("moment")

//customer function
async function getAllCustomer(pg_client){
    let query
    let value
    let success
    let result

    try {
        query= `select customer_id,membership_id,name,nik,phone_number
                from customer
                order by customer_id`
        value=[]
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

async function getCustomerById(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select customer_id,membership_id,name,nik,phone_number
                from customer
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

async function addCustomer(pg_client,name,nik,phone,membership,password){
    let query
    let value
    let success
    let result

    try {
        query= `insert into customer (name,nik,phone_number,membership_id,password)
                Values($1,$2,$3,$4,$5)`
        value=[
            name,
            nik,
            phone,
            membership,
            password
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

async function updateCustomer(pg_client,id,name,nik,phone,membership,password){
    let query
    let value
    let success
    let result

    try {
        query= `update customer
                set "name" = $2,
                "nik" = $3,
                "phone_number"=$4,
                "membership_id"=$5,
                "password"=$6
                where customer_id=$1`
        value=[
            id,
            name,
            nik,
            phone,
            membership,
            password
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

async function updateTokenKey(pg_client,id,token){
    let query
    let value
    let success
    let result

    try {
        query= `update customer 
                set "token_key" =$2,
                where customer_id =$1`
        value=[
            id,
            token
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

async function deleteCustomer(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `delete from customer
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

async function checkingNameExist(pg_client,name){
    let query
    let value
    let success
    let result

    try {
        query= `select * from customer
                where name=$1`
        value=[
            name
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

//cars function
//
async function getAllCars(pg_client){
    let query
    let value
    let success
    let result

    try {
        query= `select * from cars
                order by cars_id`
        value=[]
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

async function getCarById(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select * from cars
                where cars_id=$1`
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

async function addcar(pg_client,name,price,stock){
    let query
    let value
    let success
    let result

    try {
        query= `insert into cars (name,rent_price_daily,stock)
                Values($1,$2,$3)`
        value=[
            name,
            price,
            stock
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

async function updateCar(pg_client,id,name,price,stock){
    let query
    let value
    let success
    let result

    try {
        query= `update cars
                set "name" = $2,
                "rent_price_daily" = $3,
                "stock"=$4
                where cars_id=$1`
        value=[
            id,
            name,
            price,
            stock
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

async function deletecar(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `delete from cars
                where cars_id=$1`
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

//booking function
//
async function getAllBooking(pg_client){
    let query
    let value
    let success
    let result

    try {
        query= `select * from booking
                order by booking_id`
        value=[]
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

//driver intensive function

async function getAllIncentive(pg_client){
    let query
    let value
    let success
    let result

    try {
        query= `select * from driver_incentive
                order by driver_incentive_id`
        value=[]
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

async function getIncentiveByid(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select * from driver_incentive
                where driver_incentive_id=$1`
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

async function addDriverIncentive(pg_client,bookid,price){
    let query
    let value
    let success
    let result

    try {
        query= `insert into driver_incentive (booking_id,incentive)
                Values($1,$2)
                Returning driver_incentive_id`
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

async function updateDriverIncentiveByincentiveId(pg_client,id,bookid,price){
    let query
    let value
    let success
    let result

    try {
        query= `update driver_incentive
                set "booking_id" = $2,
                "incentive" = $3
                where driver_incentive_id=$1`
        value=[
            id,
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

async function deleteDriverIncentive(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `delete from driver_incentive
                where driver_incentive_id=$1`
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


function changeDateToUnix(result){
    for(var i in result){
        result[i]["start_time"] = moment(result[i]["start_time"]).unix();
        result[i]["end_time"] = moment(result[i]["end_time"]).unix();
    }
    return result
}

//membership function

async function getAllMembership(pg_client){
    let query
    let value
    let success
    let result

    try {
        query= `select * from membership
                order by membership_id`
        value=[]
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

async function getMembershipByid(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select * from membership
                where membership_id=$1`
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

async function addMembership(pg_client,name,discount){
    let query
    let value
    let success
    let result

    try {
        query= `insert into membership (name,daily_discount)
                Values($1,$2)`
        value=[
            name,
            discount
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

async function updateMembership(pg_client,id,name,discount){
    let query
    let value
    let success
    let result

    try {
        query= `update membership
                set "name" = $2,
                "daily_discount" = $3
                where membership_id=$1`
        value=[
            id,
            name,
            discount
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

async function deleteMembership(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `delete from membership
                where membership_id=$1`
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

//driver function

async function getAllDriver(pg_client){
    let query
    let value
    let success
    let result

    try {
        query= `select * from driver
                order by driver_id`
        value=[]
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

async function getDriverByid(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `select * from driver
                where driver_id=$1`
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

async function addDriver(pg_client,name,nik,phone,cost){
    let query
    let value
    let success
    let result

    try {
        query= `insert into driver (name,nik,phone_number,daily_cost)
                Values($1,$2,$3,$4)`
        value=[
            name,
            nik,
            phone,
            cost
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

async function updateDriver(pg_client,id,name,nik,phone,cost){
    let query
    let value
    let success
    let result

    try {
        query= `update driver
                set "name" = $2,
                "nik" = $3,
                "phone_number" = $4,
                "daily_cost" = $5
                where driver_id=$1`
        value=[
            id,
            name,
            nik,
            phone,
            cost
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

async function deleteDriver(pg_client,id){
    let query
    let value
    let success
    let result

    try {
        query= `delete from driver
                where driver_id=$1`
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


exports.allCustomer = getAllCustomer
exports.customerById = getCustomerById
exports.addCustomer = addCustomer
exports.updateCustomer = updateCustomer
exports.deleteCustomer = deleteCustomer
exports.updateTokenKey = updateTokenKey
exports.checkingNameExist = checkingNameExist

exports.allcars = getAllCars
exports.carsById = getCarById
exports.addcar = addcar
exports.updateCar = updateCar
exports.deletecar = deletecar

exports.allBooking = getAllBooking
exports.viewbookingById = getBookingById
exports.addBooking = addBooking
exports.updateBooking = updateBooking
exports.deleteBooking = deleteBooking
exports.viewbookingbyCustomerId = getBookingByCustomerId

exports.getMembershipDiscount = getMembershipByCustomerID

exports.getDriverPayment = getDriverPayment

exports.allIncentive = getAllIncentive
exports.viewIncentiveById = getIncentiveByid
exports.addDriverIncentive = addDriverIncentive
exports.updateDriverIncentive = updateDriverIncentiveByBookingId
exports.updateIncentiveById = updateDriverIncentiveByincentiveId
exports.deleteDriverIncentive = deleteDriverIncentiveFromBookId
exports.deleteIncentive = deleteDriverIncentive

exports.convertToUnix = changeDateToUnix

exports.allMembership = getAllMembership
exports.viewMembershipById = getMembershipByid
exports.addMembership = addMembership
exports.updateMembership = updateMembership
exports.deleteMembership = deleteMembership

exports.allDriver = getAllDriver
exports.viewDriverById = getDriverByid
exports.addDriver = addDriver
exports.updateDriver = updateDriver
exports.deleteDriver = deleteDriver