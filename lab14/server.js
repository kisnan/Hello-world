var express = require('express');
var app = express();
var myParser = require("body-parser"); 
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');
var fs = require('fs');

//user_data = require('./user_data.json');
//console.log(user_data);
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
//*
//*
//*
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
    }
    
    //response.send(`${username} is registered` + qs.stringify(request.query) );
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
    //When the user username is defined,
    if(typeof user_data[username_entered] != 'undefined'){
        //When the password match with the user_data.json, logged in
        //Invoice will be present when the user logged in
        if(user_data[username_entered]['password'] == password_entered){
            response.redirect('invoice.html?' + qs.stringify(request.query));
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
});

//*
//*
//*
//*Registration process
//app.post('/process_register', function (request, response, next) {
    //response.send(request.body);    
//});

app.post('/check_user', function (request, response, next) {
    if(typeof user_data[request.query["username"]] != 'undefined'){
        response.json({"username_exist": true});
    }else{
        response.json({"username_exist": false});
    }
});//micor service

app.use(express.static('./static'));

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port)});

