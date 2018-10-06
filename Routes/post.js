const express = require('express');
const router = express.Router();
// const { app } = require('./../Express/express.js');
const { mongoose } = require('./../mongoose/mongoose-connect.js');
const bodyParser = require('body-parser');
const { postModel } = require('../Modals/postModel.js');
const { authenticate } = require('./../middleware/authenticate.js');
const _ = require('lodash');
const app = express();
const fs = require('fs');
const {imageupload} = require('./../middleware/imageupload.js');
// app.use(bodyParser.json());

router.post('/add',authenticate,(request,response)=>{
    console.log('start post');
    console.log(request,undefined,3);
    var post =_.pick(request.body,['Image','Video','Content','Comment','Veiws','Save']);
     var newPost=new postModel({
        // UserName:request.body.UserName,
        Image:post.Image,
        Video:post.Video,
        Content:post.Content,
        Comment:post.Comment,
        Veiws:post.Veiws,
        Save:post.Save
    });

    console.log('mid post');
    console.log(post);
    newPost.save().then(() => {
        return newPost;
    }).catch((e) => {
        console.log('Error Registering User', e);
        response.status(400).send();
    })
    console.log('end post');
});

router.get('/',authenticate,(request, response) => {
    postModel.find({ Creator: request.body.UserName }).then((newpost) => {
        console.log(request.body.UserName);
        console.log('post');
        console.log(newpost);
        response.status(200).send(newpost);
    }, (error) => {
        console.log('cannot get post', error);
    }).catch((e) => {
        console.log('Exception caught', e);
    });
});

router.delete('/delete/:id',authenticate,(request, response) => {
    var id = request.params.id;

    // if (!ObjectId.isValid(id)) {
    //     return res.status(400).send();
    // }

    postModel.findByIdAndRemove(id).then((deletedPost) => {
        if (!deletedPost) {
            response.status(404).send('No such company exist, enter avaliable id');
        }
        response.status(200).send(`Deleted Company is -> ${deletedpost}`);
    }, (error) => {
        console.log('Error while deleting', error);
        response.status(400).send();
    }).catch((e) => {
        response.status(400).send();
    });
});

router.patch('/update/:id', authenticate, (request, response) => {
    var body = _.pick(request.body, ['Image', 'Video', 'Content','Comment', 'Veiws', 'Save']);
    var id = request.params.id;
    console.log(body);
    postModel.findByIdAndUpdate(id, {
        $set: {
            Image:body.Image,
            Video:body.Video,
            Content:body.Content,
            Comment:body.Comment,
            Veiws:body.Veiws,
            Save:body.Save    
        }
    }).then((updatedPost) => {
        response.status(200).send(updatedPost);
    }).catch((e) => {
        console.log('Exception Occured', e)
        response.status(400).send(e);
    })
});

router.post('/test', (request, response) => {
    var fileName = request.files.Image.name;
    console.log('Image ka naam hai ------- >',request.files.Image.name);
    console.log('start post');
    var orignalUrl = request.imageurl + fileName;
    // console.log(request, undefined, 3);
    var post = _.pick(request.body, ['Image', 'Video', 'Content', 'Comment', 'Veiws', 'Save']);
    var newPost = new postModel({
        // UserName:request.body.UserName,
        Image: orignalUrl,
        Video: post.Video,
        Content: post.Content,
        Comment: post.Comment,
        Veiws: post.Veiws,
        Save: post.Save
    });

    console.log('mid post');
    console.log(post);

    newPost.save().then((postSaved) => {
        response.status(200).send(postSaved);
        console.log('saved post is--------->',postSaved);
        return postSaved.sendFile(request.files.Image);
    }).catch((e) => {
        console.log('Error Registering User', e);
        response.status(400).send();
    })
    console.log('end post');
});

module.exports = router;