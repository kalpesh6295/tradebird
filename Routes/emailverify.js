const { mongoose } = require('./../mongoose/mongoose-connect.js');
const bodyParser = require('body-parser');
const { userModel } = require('../Modals/userModel.js');
const _ = require('lodash');
const nodemailer = require('nodemailer');
'use strict';
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var app = express();
app.use(bodyParser.json());

router.get('/:token/:email', function (req, res) {

            userModel.findOne({Email:req.params.email}).then((docs) => {
                console.log(docs.isVerified);
                console.log(docs._id);
                var id=docs._id;
                if(docs.isVerified===true)
                {
                    res.send("<h1> already verified");
                }
                else{
                    Emailtoken = docs.tokens[0].token;
                    if (req.params.token === Emailtoken) {
                        res.send("<h1>verified");
                        console.log("verified");
                    userModel.findByIdAndUpdate(id, { $set: { isVerified: true } },{returnOriginal:true}).then((docs)=>{
                        console.log('changed->',docs.isVerified);
                    });
                }
                else{
                    res.send("<h1>bad request");
                }
            }
            }, (error) => {
                console.log('error saving data');
            }).catch((e) => {
                console.log('exception caught');
                res.status(400).send(e);
            });
    //    }
    //     else {
    //         res.send("bad request");
    //     }
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });
});

module.exports=router;