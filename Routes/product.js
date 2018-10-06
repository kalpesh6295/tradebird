const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bodyParser = require('body-parser');
const {productModel} = require('./../Modals/productModel.js');
const {userModel} = require('./../Modals/userModel');
// const {app} = require('./../Express/express.js');
const {mongoose} = require('./../mongoose/mongoose-connect.js');
const {authenticate} = require('./../middleware/authenticate.js');

// app.use(bodyParser.json());

//adding product into DB
router.post('/publish',authenticate,(request,response)=>{
    console.log('id of user logged in is',request.user._id);
    console.log(request.body.company);
    var body = _.pick(request.body,['name','company','image','industry','description']);
    console.log(body)
    var product = new productModel({
            name:body.name,
            company:body.company,
            image:body.image,
            industry:body.industry,
            description:body.description,
            Creator:request.user._id,
        });
    product.save().then((result)=>{
        console.log('_id is :::----> '+request.user._id);
        console.log(result);
        return result;
    },(error)=>{
        console.log('Error Saving product',error);
        response.status(400).send(error);
    }).catch((e)=>{
        console.log('Exception caught');
        response.status(400).send(e);
    });
});

router.get('/',authenticate,(request,response)=>{
    console.log('inside router.get');
    productModel.find({Creator:request.user._id}).then((products)=>{
        console.log(request.user._id);
        console.log('-----------PPPPPPRRRRRRRRRROOOOOOOODDDDDDDDDUUUUUUUTTTTTTSSSSS---------------------------------------');
        console.log(products);
        response.status(200).send(products);
    },(error)=>{
        console.log('Cannot get all products',error);
    }).catch((e)=>{
        console.log('Exception caught',e);
    });
});


router.patch('/update/:id', authenticate, (request, response) => {
    var body = _.pick(request.body, ['name', 'company', 'image', 'industry', 'description']);
    var id = request.params.id;
    console.log(body);
    productModel.findByIdAndUpdate(id, {
        $set: {
            name: body.name,
            company:body.company,
            image:body.image,
            industry:body.industry,
            description:body.description
        }
    },{returnOriginal:false}).then((updatedProducts) => {
        response.status(200).send(updatedProducts);
    }).catch((e) => {
        console.log('Exception Occured', e)
        response.status(400).send(e);
    })
});


router.delete('/delete/:id', authenticate, (request, response) => {
    var id = request.params.id;
    // if(!ObjectID.isvalid(id)){
    //     return res.status(400).send();
    // }
    productModel.findByIdAndRemove(id).then((productCompany) => {
        if (!productCompany) {
            response.status(404).send('No such company exist, enter avaliable id');
        }
        response.status(200).send(`Deleted Company is -> ${productCompany}`);
    }, (error) => {
        console.log('Error while deleting', error);
        response.status(400).send();
    }).catch((e) => {
        response.status(400).send();
    });
});

module.exports = router;

