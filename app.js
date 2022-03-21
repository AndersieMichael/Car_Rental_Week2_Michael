const express = require('express')
const app = express()
const port = 8080

app.use(express.json())

const Customer = require('./routes/customer/customer')
const cars = require('./routes/car/car')
const booking = require('./routes/booking/booking')
const membership = require('./routes/membership/membership')
const driver = require('./routes/driver/driver')
const incentive = require('./routes/driverIncentive/driverIncentive')

const debugLog = require('./debug')

app.get('/',(req,res)=>{
    res.send('WELCOME TO CAR RENTAL')
})

app.use('/customer',Customer);
app.use('/car',cars);
app.use('/booking',booking);
app.use('/membership',membership);
app.use('/driver',driver);
app.use('/incentive',incentive);

app.listen(port,()=>{
    console.log(`server is listening in port ${port}`);
})

debugLog("This is a debug message");