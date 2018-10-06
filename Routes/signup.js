const {mongoose} = require('./../mongoose/mongoose-connect.js');
const bodyParser = require('body-parser');
const {userModel} = require('../Modals/userModel.js');
const _ = require('lodash');
const nodemailer=require('nodemailer');
'use strict';
const express = require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
var app=express();
app.use(bodyParser.json());


const host = 'localhost:3000';
var Emailtoken;
router.post('/',(request,response)=>{
    var user = _.pick(request.body,['UserName','Password','Email','Mobile','Address']);
    var newUser = new userModel(user);
    console.log(user);
    newUser.save().then(()=>{
    return newUser.generateAuthToken();
    }).then((token_recieved)=>{
        response.header('x-auth',token_recieved).send(newUser);

        // response.status(200).send(result); 
        Emailtoken=token_recieved;
        console.log(Emailtoken);
    }).catch((e)=>{
        console.log('Error Registering User',e);
        response.status(400).send();
    })
    const mailverification=nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false, // true for 465, false for other ports
            auth: {
                user: "vikibenz776@gmail.com", // generated ethereal user
                pass: "8298695800" // generated ethereal password
            }
        });
        console.log(Emailtoken);
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Tradifier.com" <vikibenz776@gmail.com>', // sender address
            to: user.Email, // list of receivers
            subject: 'Verification mail', // Subject line
            text: "http://" + host + "/verify/" +Emailtoken+"/"+user.Email
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
});


module.exports=router;