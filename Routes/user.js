const express = require('express');
const router = express.Router();
const { authenticate } = require('./../middleware/authenticate.js');
const { userModel } = require('./../Modals/userModel.js');
const _ = require('lodash');


router.get('/:id',(request,response)=>{
    var id=request.params.id;
    
    userModel.findById(id).then((userdata)=>{
       response.status(200).send(userdata);
        console.log(userdata);
    },(error)=>{
        response.status(400).send();
        console.log(error);
    }).catch((e)=>{
        console.log('excepted occured');
        response.status(400).send(e);
    });

});


router.patch('/update/:id',(request,response)=>{
    var body = _.pick(request.body, ['UserName', 'Password', 'Email', 'Mobile', 'Address']);
    var id =request.params.id;

    userModel.findOneAndUpdate(id,{
        $set:{
            UserName:body.UserName,
            Password:body.Password,
            Email:body.Email,
            Mobile:body.Mobile,
            Address:body.Address
        }
    }).then((updateddata)=>{
        console.log('updated data->',updateddata);
        response.status(200).send(updateddata);
    },(error)=>{

    })
})


module.exports=router;