const express = require('express')
const app = express()
const port = 8080

app.use(express.json())

const Customer = require('./customer')
const cars = require('./car')
const booking = require('./booking')

app.get('/',(req,res)=>{
    res.send('WELCOME TO CAR RENTAL')
})

app.use('/customer',Customer);
app.use('/car',cars);
app.use('/booking',booking)

app.listen(port,()=>{
    console.log(`server is listening in port ${port}`);
})