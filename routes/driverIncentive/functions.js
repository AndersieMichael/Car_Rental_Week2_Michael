//driver intensive function

/**
 * this function will get all driver incentive
 * 
 * @param {*} pg_client pool connection 
 * @returns 
 */

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

/**
 * this function will get driver incentive by id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id driver incentive id 
 * @returns 
 */

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

/**
 * this function will add driver incentive
 * 
 * @param {*} pg_client pool connection 
 * @param {number} bookid booking id
 * @param {number} price incentive
 * @returns 
 */

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

/**
 * this function will driver incentive from incentive id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id driver incentive id
 * @param {number} bookid booking id
 * @param {number} price incentive
 * @returns 
 */

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

/**
 * this function will delete driverIncentive by driver incentive id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id driver incentive 
 * @returns 
 */

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


exports.allIncentive = getAllIncentive
exports.viewIncentiveById = getIncentiveByid
exports.addDriverIncentive = addDriverIncentive
exports.updateIncentiveById = updateDriverIncentiveByincentiveId
exports.deleteIncentive = deleteDriverIncentive