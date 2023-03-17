const express = require('express')
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const cors = require('cors')
const app = express()
require('dotenv/config');

//import models
// const UserModel = require('./src/models/UserModel');
// const ContactModel = require('./src/models/ContactModel');
//import Routes
const UserRoute = require('./src/routes/UserRoute');
const ContactRoute = require('./src/routes/ContactRoute')

//connection to database 
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('database Connected!'))
    .catch((e) => console.log('Error!!! to connect the database'+e.message))
// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
const tokenVerification = (req,res,next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization;
        if(token){
          jwt.verify(token,process.env.SECRET,(err,decoded)=>{
            if(err){
              return res.status(403).json({
                status:"Failed",
                Error:err.name,
                message:err.name=="JsonWebTokenError"?"Not a valid Token. Pls login again":err.message
              })
            }
            req.userID = decoded.data;
            next();
          })
        }else{
          return res.status(403).json({
            status:"Failed",
            message:"Token is missing"
          })
        }
    }else{
      return res.status(403).json({
        status:"Failed",
        message:"unauthorised access. Pls login before access"
      })
    }
}

//define route path
app.use('/api/users',UserRoute)
app.use('/api/contacts',tokenVerification,ContactRoute)

//Welcome Page
app.use("/",(req,res)=>{
  res.status(200).json({
    status:"Success",
    message: "Welcome to contact-manager-app-backend-API. we service two APIs which are /api/users and /api/contacts"
  })
})

//BAD REQUEST
app.use('*',(req, res)=>{
  res.status(404).json({
    status: 'Failed',
    message: '404! not found'
  })
})


app.listen(4000, () => console.log('server start at port 4000....'))
