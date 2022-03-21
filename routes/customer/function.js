//customer Function


/**
 * This function will get all customer data from database
 * 
 * @param {*} pg_client pool connection 
 * @returns 
 */
async function getAllCustomer(pg_client){
    let query
    let success
    let result

    try {
        query= `select customer_id,membership_id,name,nik,phone_number
                from customer
                order by customer_id`
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
 * This function will get customer by customer id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id customerID
 * @returns 
 */

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

/**
 * This function will add customer
 * 
 * @param {*} pg_client pool connection 
 * @param {string} name customer Name
 * @param {string} nik customer NIK
 * @param {string} phone customer phone
 * @param {number} membership customer membership, fk from membership
 * @param {string} password customer password already encrypt
 * @returns 
 */

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

/**
 * This function will update customer
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id customer id
 * @param {string} name customer Name
 * @param {string} nik customer NIK
 * @param {string} phone customer phone
 * @param {number} membership customer membership, fk from membership
 * @param {string} password customer password already encrypt
 * @returns 
 */

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

/**
 * 
 * This function will add/update customer token
 * 
 * @param {*} pg_client pool connection 
 * @param {Number} id customer id
 * @param {string} token customer refresh token from jwt token
 * @returns 
 */

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

/**
 * This function will delete the customer from customer id
 * 
 * @param {*} pg_client pool connection 
 * @param {number} id customer id 
 * @returns 
 */

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

/**
 * This function will checking Name in Database
 * 
 * @param {*} pg_client pool connection 
 * @param {string} name customer name 
 * @returns 
 */

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



exports.allCustomer = getAllCustomer
exports.customerById = getCustomerById
exports.addCustomer = addCustomer
exports.updateCustomer = updateCustomer
exports.deleteCustomer = deleteCustomer
exports.updateTokenKey = updateTokenKey
exports.checkingNameExist = checkingNameExist
