const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    company:{
        type:String,
        required:true,
        trim:true
    },
    industry:{
        type:String,
        trim:true
    },
    image:{
        type:String
    },
    description:{
        type:String,
        // required:true,
        trim:true
    },
    Creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

var productModel = mongoose.model('product',productSchema);

module.exports = {productModel};