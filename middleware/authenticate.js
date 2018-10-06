const {userModel} = require('./../Modals/userModel.js');

var authenticate = (request,response,next) =>{
    console.log('Authenticating...')
    var token = request.header('x-auth');
    console.log(token);
    userModel.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        // response.send(user);
        request.user = user;
        request.token = token;
        next();
    }).catch((e)=>{
        response.status(401).send();
    });
};

module.exports = {authenticate};
