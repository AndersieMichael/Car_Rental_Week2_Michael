//cars function


/**
 * this function will get all cars
 * 
 * @param {*} pg_client pool connection 
 * @returns 
 */
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

/**
 * this function will get all car from car id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id car id
 * @returns 
 */

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

/**
 * this function will add car 
 * 
 * @param {*} pg_client pool connection 
 * @param {string} name car name 
 * @param {number} price car price 
 * @param {number} stock car stock
 * @returns 
 */

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

/**
 * this function will update car by car id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id car id
 * @param {string} name car name
 * @param {number} price car price
 * @param {number} stock car stock 
 * @returns 
 */

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

/**
 * this function will delete car from delete id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id car id 
 * @returns 
 */

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

exports.allcars = getAllCars
exports.carsById = getCarById
exports.addcar = addcar
exports.updateCar = updateCar
exports.deletecar = deletecar