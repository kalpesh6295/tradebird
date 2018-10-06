const fs = require('fs');
const express = require('express');
const router=express.Router();
const env=require('./../config/env.js');
const multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
const S3FS = require('s3fs');
const {userModel}=require('./../Modals/userModel.js');
const {mongoose}=require('./../mongoose/mongoose-connect.js');
const s3fsImpl = new S3FS('tradifieruserimage1', {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
});
router.use(multipartyMiddleware);

 router.post('/:id', (req, res) => {
console.log(req.files.file);
var myfile = req.files.file;
//var key=req.files.file.name;
const awsurl = "https://s3.amazonaws.com/tradifieruserimage1/";
console.log(awsurl);
var stream = fs.createReadStream(myfile.path);
return s3fsImpl.writeFile(myfile.originalFilename, stream).then(() => {
    fs.unlink(myfile.path, (err) => {
        if (err) {
            console.error(err);
        }
        else {
            //console.log(req.files.upload);
            console.log('upload successfully');
        }
    });
        const image = awsurl + req.files.file.name;
        console.log(image);

        userModel.findByIdAndUpdate(req.params.id, {
            $set: { Image: image }
        }).then((user) => {
            console.log('Data Updated', user);
            res.status(200).send(result);
        }, (error) => {
            console.log('Error saving product');
            res.status(400).send(error);
        }).catch((e) => {
            console.log('Exception caught');
            res.status(400).send(e);
        });
    });        
 });
module.exports=router;

