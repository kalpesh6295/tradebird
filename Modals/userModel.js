const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var userSchema = new mongoose.Schema({
    UserName:{ 
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    Password:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    isVerified: 
    {   type: Boolean, 
        default: false 
    },
    Mobile:{
        type:Number,
        trim:true
    },
    Address:{
        type:String,
        trim:true
    },
    DateOfBirth:{
        type:Date,
        trim:true,
        default:Date.now()
    },
    Image:{
        type:String
    },
    Following:{
        company:[{type:mongoose.Schema.Types.ObjectId}]
    },
    //type:mongoose.Schema.Types.ObjectId,
    Company_id:[{type:mongoose.Schema.Types.ObjectId,auto:true}],
    bookmarks:{
        post:[{type:mongoose.Schema.Types.ObjectId}],
        product:[{type:mongoose.Schema.Types.ObjectId}],
        company:[{type:mongoose.Schema.Types.ObjectId}]
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.generateAuthToken = function (){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});

    return user.save().then(()=>{
        // console.log(token);
        return token;
    });
    // return token;
};

userSchema.methods.removeToken = function(token) {
    var user = this;
    console.log(token);
    if(!token){
        return Promise.reject(`Token is ${token}`);
    }
    return user.update({
        $pull:{tokens:{token}}
    });
}

userSchema.statics.findByCredentials = function(email,password){

    var userModel = this;
    console.log('inside findByCredentials :----> ', email,password);
    // console.log(userModel);
   return userModel.findOne({Email:email}).then((user)=>{
    console.log(user);
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve,reject)=>{
            console.log('password:',password);
            console.log('user.Password:',user.Password);
            bcrypt.compare(password,user.Password,(error,result)=>{
                if(result){
                    resolve(user);
                }else{
                    console.log(error);
                    reject('not found');
                }
            });
        });
    });
};

userSchema.statics.findByToken = function(token){
    var userModel = this;
    var decoded;

    try{
        decoded = jwt.verify(token,'abc123');
        console.log('decoded----->',decoded);
    }
    catch(e){
        // return new Promise((resolve,reject)=>{
        //     return reject();
        // });
        console.log('Error Occured!');
        return Promise.reject();
    }

    return userModel.findOne({
        _id:decoded._id,
        'tokens.token': token,
        'tokens.access':'auth'
    });
};

userSchema.pre('save',function(next){
    console.log('Starting of Pre.........');
    var user = this;
    console.log
    if(user.isModified('Password')){
        var password = user.Password;
        console.log(password)
        bcrypt.genSalt(10,(error,salt)=>{
            bcrypt.hash(password,salt,(error,hash)=>{
                user.Password = hash; 
                console.log(user.password)
                next();
            })
        })
    }else{
        next();
    }
    console.log('Ending of Pre...........');
});


var userModel = mongoose.model('user',userSchema);

module.exports = {userModel};
