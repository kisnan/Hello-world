//*
//*
//*Project: Assignemnt1
//*ITM352
//*Author: Qiyan Lin
//*Professor: Den Port
//*This code mean to be programming a server for Assignemnt3
var express = require('express');
var app = express();
var myParser = require("body-parser"); 
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');
var fs = require('fs');
var cookieParser = require('cookie-parser');
const { response } = require('express');
app.use(cookieParser());
var session = require('express-session');
var user_data_file = './user_data.json';
    if(fs.statSync(user_data_file)){
        var file_stats = fs.statSync(user_data_file);
        //console.log(`${user_data_file} has ${file_stats["size"]} charaters.`);
        //the code above for telling how many charater on the product.json
        var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
    }else{
        console.log(`${user_data_file} does not exist!`);
    }

app.all('*', function(request, response, next){
    console.log(request.method + ' to ' + request.path);
    next();
});

//*Registration process
//*Add a new user to the user_data.json
app.post('/process_register', function(request, response){
    username = request.body["uname"];
    console.log(request.query);
    let username_entered = request.body["uname"];
    if(typeof user_data[username_entered] != 'undefined'){
        //Need to prove this is undefined so the username is not exit on the user_data.json
        response.send(`${username_entered} has been used, please try again`);
    }else{
        user_data[username] = {};
        user_data[username]["password"] = request.body["psw"];
        user_data[username]["email"] = request.body["email"];
        user_data[username]["name"] = request.body["fullname"];
        //save the user_data to the user_data.json
        //reverse the readFileSync, and convert the new user data to JSON
        fs.writeFileSync(user_data_file, JSON.stringify(user_data));
        request.query["name"] = request.body["fullname"];
        request.query["email"] = request.body["email"];
        response.redirect('invoice.html?' + qs.stringify(request.query));
    }    //response.send(`${username} is registered` + qs.stringify(request.query) );
});
//*
//*
//*
//*Login process
app.post('/process_login', function (request, response, next) {
    console.log(request.query);
    //check login and password match the database
    let username_entered = request.body["uname"];
    let password_entered = request.body["psw"];
    //Check if the "cookie_user" exist
    if(typeof request.cookies["cookie_user"] != 'undefined'){
        console.log('Cookie is now available');
        //By pass the process_login direct to the invoice
        //response.redirect('cart.html?' + qs.stringify(request.query));     
    }
        //Check if the "cookie_user" does not exist, procee to the login
        //Check if the the username_enter is valid,
        if(typeof user_data[username_entered] != 'undefined'){
            //When the password match with the user_data.json, logged in
            //Invoice will be present when the user logged in
            if(user_data[username_entered]['password'] == password_entered){
                response.cookie("cookie_user" ,request.body['uname'], {maxAge: 1200*1000});//60s the cookie will be killed
                str = `<script>alert("Hi, Logged in successful");window.history.back();</script>`;
                response.redirect('invoice.html?');
                console.log(str);
                response.send(str);
                return;
        }else{
            //When the passward does not match with the user_data.json, send the password is wrong
            response.send(`${username_entered} password wrong`);
            }
        }else{
            //When the username is not defined, send the user is not found.
            //refer to the line37
            response.send(`${username_entered} not found`);
        }   
});
//*Registration process
app.post('/check_user', function (request, response, next) {
    if(typeof user_data[request.query["username"]] != 'undefined'){
        response.json({"username_exist": true});
    }else{
        response.json({"username_exist": false});
    }
});
//*play with cookies
app.get('/set_cookie', function(request, response, next){
    if(typeof user_data[username_entered] != 'undefined'){
        //When the password match with the user_data.json, logged in
        //Invoice will be present when the user logged in
        if(user_data[username_entered]['password'] == password_entered){
            response.cookie(request.body['uname'], cookie_user, {maxAge: 5000});//5s the cookie will be killed
            //response.send(`${username_entered} is logged in!!!`);//Do I need this??????   
        }else{
            //When the passward does not match with the user_data.json, send the password is wrong
            response.send(`${username_entered} password wrong`);
        }
    }
    else{
        //When the username is not defined, send the user is not found.
        //refer to the line37
        response.send(`${username_entered} not found`);
    }   
    now = new Date();
    console.log(`Cookie for ${request.body['uname']} sent`);
    next();
});

app.get('/process_invoice', function(req, res, next){
    if(typeof req.cookies["cookie_user"] != 'undefined'){

        res.redirect('invoice.html?');
    }else{
        res.redirect('login.html');
    }
    next();    
});
//session part
//encryption
app.use(session({secret: "ITM352 rocks!"}));
app.get('/set_session', function(request, response, next){
    response.send(`Welcome, your session ID is ${request.session.id}`);
    next();
});
//To check if my session is current
app.get('/use_session', function(request, response, next){
    response.send(`Your session ID is ${request.session.id}`);
    next();
});
//
app.post('/checkout', function (request, response, next) {
    //check if the user is login
    if(typeof request.cookies["cookie_user"] != 'undefined'){
        console.log('Cookie is now available');
        //By pass the process_login direct to the invoice
        request.session.cart = request.query.quantity; 
        response.redirect('invoice.html?');

    }else{
        response.redirect('login.html?');
    }
    //if so, send the invoice

    //if not, send to the login
});





app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});

app.get("/add_to_cart", function (request, response) {
    console.log(request.query)
    request.session.cart = request.query.quantity; 
    response.redirect('./cart.html');
});

app.post("/get_cart", function (request, response) {
    response.json(request.session.cart);
});

app.use(express.static('./static'));

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port)});

