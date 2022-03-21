//membership function

/**
 * this function will get all membership
 * 
 * @param {*} pg_client pool connection 
 * @returns 
 */

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

/**
 * this function will get membership by membership id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id membership id
 * @returns 
 */

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

/**
 * this function will add membership
 * 
 * @param {*} pg_client pool connection 
 * @param {string} name membership name
 * @param {number} discount membership discount
 * @returns 
 */

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

/**
 * this function will update membership by membership id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id  membership id
 * @param {string} name membership name
 * @param {number} discount membership discout float
 * @returns 
 */

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

/**
 * this function will delete membership by membership id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id membership id
 * @returns 
 */

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

exports.allMembership = getAllMembership
exports.viewMembershipById = getMembershipByid
exports.addMembership = addMembership
exports.updateMembership = updateMembership
exports.deleteMembership = deleteMembership