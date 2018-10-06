const mongoose = require('mongoose');
const {userModel} = require('../Modals/userModel.js');
const {ObjectID} = require('mongodb');

mongoose.connect('mongodb://localhost:27017/Tradifier');

var user = new userModel({
    UserName:'abhiraj  ',
    Password:'1234',
    Email:'abc@123.com',
    Mobile:1231231212,
    Address:'durgapura jaipur'
});

user.save().then((doc)=>{
    console.log('Data saved');
    console.log(doc,undefined,2);
},(error)=>{
    console.log('Not Saved!');
    console.log(error)
});
