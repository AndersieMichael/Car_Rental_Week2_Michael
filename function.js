const moment = require("moment")

//customer function
async function getAllCustomer(pg_client){
    let query
    let value
    let success
    let result

    try {
        query= `select * from customer
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
        query= `select * from customer
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

async function addCustomer(pg_client,name,nik,phone){
    let query
    let value
    let success
    let result

    try {
        query= `insert into customer (name,nik,phone_number)
                Values($1,$2,$3)`
        value=[
            name,
            nik,
            phone
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

async function updateCustomer(pg_client,id,name,nik,phone){
    let query
    let value
    let success
    let result

    try {
        query= `update customer
                set "name" = $2,
                "nik" = $3,
                "phone_number"=$4
                where customer_id=$1`
        value=[
            id,
            name,
            nik,
            phone
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

async function addBooking(pg_client,custid,carid,startT,endT,cost,finish){
    let query
    let value
    let success
    let result

    try {
        query= `insert into booking (customer_id,cars_id,start_time,end_time,total_cost,finished)
                Values($1,$2,$3,$4,$5,$6)`
        value=[
            custid,
            carid,
            startT,
            endT,
            cost,
            finish
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

async function updateBooking(pg_client,id,custid,carid,startT,endT,cost,finish){
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
                "finished"=$7
                where booking_id=$1`
        value=[
            id,
            custid,
            carid,
            startT,
            endT,
            cost,
            finish
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


function changeDateToUnix(result){
    for(var i in result){
        result[i]["start_time"] = moment(result[i]["start_time"]).unix();
        result[i]["end_time"] = moment(result[i]["end_time"]).unix();
    }
    return result
}


exports.allCustomer = getAllCustomer
exports.customerById = getCustomerById
exports.addCustomer = addCustomer
exports.updateCustomer = updateCustomer
exports.deleteCustomer = deleteCustomer

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

exports.convertToUnix = changeDateToUnix