const express = require('express');
const router = express.Router();
const {authenticate} = require('./../middleware/authenticate.js');
const _ = require('lodash');
const {userModel} = require('../Modals/userModel.js');
const {postModel} = require('./../Modals/postModel.js');
const {productModel} = require('./../Modals/productModel.js');

var postId;

router.patch('/post/:id',authenticate,(request,response)=>{
    postId = request.params.id;
    postModel.findById(postId).then((post)=>{
        if(!post){
            return response.status(404).send();
        }
    })
    userModel.findByIdAndUpdate(request.user._id,{
        $push:{
            'bookmarks.post':postId
        }
    }).then((user)=>{
        console.log('Updated User bookmark array',user);
        response.status(200).send(user);
    }).catch((e)=>{
        response.status(400).send(e);
        console.log('Exception Caught bookmarking-->',e);
    })
});

router.patch('/product/:id',authenticate,(request,response)=>{
    productId = request.params.id;
    productModel.findById(productId).then((product)=>{
        if(!product){
            return response.status(404).send();
        }
    })
    userModel.findByIdAndUpdate(request.user._id,{
        $push:{
            'bookmarks.product':productId
        }
    }).then((user)=>{
        console.log('Updated User bookmark array',user);
        response.status(200).send(user);
    }).catch((e)=>{
        response.status(400).send(e);
        console.log('Exception Caught bookmarking-->',e);
    })
});

module.exports = router;