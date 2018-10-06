const mongoose = require('mongoose');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const env = require('./../config/env.js');
// const multiparty = require('connect-multiparty'),
//     multipartyMiddleware = multiparty();
const S3FS = require('s3fs');
const { userModel } = require('./../Modals/userModel.js');
const s3fsImpl = new S3FS('tradifieruserimage1', {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
});


var postSchema=new mongoose.Schema({
    Image:{
        type:String
    },
    Video:{
        type:String
    },
    Time:{
        type:Date,
        trim:true,
        default:Date.now()
    },
    Content:{
        type:String,
        required:true
    },
    Comment:{
        type:Array,
    },
    Veiws:{
        type:Number,
        default:0
    },
    Save:{
        type:String,
        default:0
    }
});
postSchema.methods.sendFile=function(file){
    var post = this;
    var myfile=file;
    const awsurl = "https://s3.amazonaws.com/tradifieruserimage1/";
    
    console.log(awsurl);
    var stream = fs.createReadStream(myfile.path);
    return s3fsImpl.writeFile(myfile.originalFilename, stream).then(() => {
        fs.unlink(myfile.path, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log('upload successfully');
                var imageUrl=awsurl.toString()+file.name;
                console.log(imageUrl);
                return imageUrl;
            }
        });
    });

}


postSchema.methods.sendPostId = function(id){
    // var post = this;
    postModel.findById(id).then((post)=>{
        if(!post){
            return null;
        }
        return post._id
    })
}

var postModel = mongoose.model('post', postSchema);

module.exports={postModel};