const fs = require('fs');
const express = require('express');
const router = express.Router();
const env = require('./../config/env.js');
const multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
const S3FS = require('s3fs');
const { userModel } = require('./../Modals/userModel');
const { mongoose } = require('./../mongoose/mongoose-connect.js');
const s3fsImpl = new S3FS('tradifieruserimage1', {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
});
const app = express();
app.use(multipartyMiddleware);

var imageupload=(request,response,next)=>{
    console.log(request.files.file);
    var myfile = request.files.file;
    //var key=req.files.file.name;
    const awsurl = "https://s3.amazonaws.com/tradifieruserimage/";
    console.log(awsurl);
    var stream = fs.createReadStream(myfile.path);
    return s3fsImpl.writeFile(myfile.originalFilename, stream).then(() => {
        fs.unlink(myfile.path, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log('upload successfully');
                request.imageurl = awsurl;
                //console.log(req.files.upload);
            }
        });
    });
    // const imageurl=awsurl+request.files.file.name;
};

module.exports={imageupload};