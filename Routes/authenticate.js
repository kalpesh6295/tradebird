const express = require('express');
const router = express.Router();
const _ = require('lodash');
'use strict';
const {mongoose} = require('./../mongoose/mongoose-connect.js');
const bodyParser = require('body-parser');
const {userModel} = require('../Modals/userModel.js');
const {imageupload}=require('./../Routes/imageupload.js');
const nodemailer = require('nodemailer');
const {authenticate} = require('./../middleware/authenticate.js');
const host = 'localhost:3000';
var Emailtoken;



router.post('/signup',(request,response)=>{
    
    var user = _.pick(request.body,['UserName','Password','Email','Mobile','Address']);
    
    var newUser = new userModel({
        UserName:user.UserName,
        Password:user.Password,
        Email:user.Email,
        Mobile:user.Mobile,
        Address:user.Address,
        Image:request.image
    });
    console.log(user);
    newUser.save().then(()=>{

    return newUser.generateAuthToken();

    }).then((token_recieved)=>{
        response.header('x-auth',token_recieved).send(newUser);
        
        Emailtoken = token_recieved; 
        console.log('token is',token_recieved);
    }).catch((e)=>{
        console.log('Error Registering User',e);
        response.status(400).send();
        })
        const mailverification = nodemailer.createTestAccount((err, account) => {
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
                text: "http://" + host + "/verify/" + Emailtoken + "/" + user.Email
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


router.post('/login',(request,response)=>{
    if(!loggedIn){
        var body = _.pick(request.body,['Email','Password']);
            console.log(request.body)
            console.log(body);
            userModel.findByCredentials(body.Email,body.Password).then((user)=>{
                if(!user){
                    return response.status(400).send();
                }
                console.log(`User found is ---> ${user}`);
                user.generateAuthToken().then((token)=>{
                    loggedIn = true;
                    response.header('x-auth',token).send(user);
                });
            }).catch((e)=>{
                console.log('Error is ',e);
                response.status(400).send();
                console.log(e);
            })
    }
    else{
        console.log('You Are Already Logged In, LogOut First');
        response.status(409).send('You Are Already Logged In, LogOut First');
    }

});

router.delete('/logout',authenticate,(request,response)=>{
    var user = request.user;
    var token = request.token;
    console.log('token is ',token);
    user.removeToken(token).then((result)=>{
        loggedIn = false;
        console.log(result);
        response.status(200).send('You have been logged out succesfully!');
    }).catch((e)=>{
        response.status(400).send(e);
    })
});

module.exports = router;

// app.listen(3000,(status)=>{
//     console.log('Server Up on port 3000');
// });