//driver function

/**
 * this function will get all driver 
 * 
 * @param {*} pg_client pool connection 
 * @returns 
 */

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

/**
 * this function will get driver by id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id driver id
 * @returns 
 */

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

/**
 * this function will add driver
 * 
 * @param {*} pg_client pool connection 
 * @param {string} name driver name 
 * @param {string} nik driver nik
 * @param {string} phone driver phone
 * @param {number} cost driver cost
 * @returns 
 */

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

/**
 * this function will update driver by driver id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id driver id 
 * @param {string} name driver name 
 * @param {string} nik driver nik
 * @param {string} phone driver phone
 * @param {number} cost driver cost
 * @returns 
 */

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

/**
 * this function will delete driver by id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id driver id 
 * @returns 
 */

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

exports.allDriver = getAllDriver
exports.viewDriverById = getDriverByid
exports.addDriver = addDriver
exports.updateDriver = updateDriver
exports.deleteDriver = deleteDriver