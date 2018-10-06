const express = require('express');
const bodyParser = require('body-parser');
var helmet = require('helmet')

var productsRouter = require('./../Routes/product.js');
var authenticationRouter = require('./../Routes/authenticate.js');
var postRouter = require('./../Routes/post.js');
var bookmarkRouter = require('./../Routes/bookmark.js');
var companyRouter = require('./../Routes/company.js');
var imageuploadRouter=require('./../Routes/imageupload.js');
//var signupRouter=require('./../Routes/signup.js');
var emailverifyrouter=require('./../Routes/emailverify.js');
var userpageRouter=require('./../Routes/user.js')

var app = express();
const multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
// var authRouter = require('./../Routes/signup');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine','jade');
// app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(bodyParser.json());


app.use(express.urlencoded({ extended: false }));
app.use(multipartyMiddleware);
app.use((req, res, next) => {
    // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', '*');
     
     // Request methods you wish to allow
     res.setHeader("Access-Control-Allow-Credentials", "true");
     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Boundary,Access-Control-Request-Method, Access-Control-Request-Headers,x-auth");
     res.setHeader("Access-Control-Expose-Headers", "x-auth");
      
     // Pass to next layer of middleware
     next();
  });
//app.use('/signup',signupRouter);
app.use('/user',userpageRouter);
app.use('/products',productsRouter);
app.use('/auth',authenticationRouter);
app.use('/post',postRouter);
app.use('/bookmark',bookmarkRouter);
app.use('/company',companyRouter);
app.use('/userimageupload',imageuploadRouter);
app.use('/verify',emailverifyrouter);

const port = process.env.PORT ||3000;
app.listen(3000,(status)=>{
    console.log('Server up on the port '+port);
})
