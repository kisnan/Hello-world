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

app.use(session({secret: "ITM352 rocks!"}));
//play with session
app.get('/set_session', function(request, response, next){
    response.send(`Welcome, your session ID is ${request.session.id}`);
    next();
});

app.get('/use_session', function(request, response, next){
    response.send(`Your session ID is ${request.session.id}`);
    next();
});

//play with cookies
app.get('/set_cookie', function(request, response, next){
    let my_name = 'Qiyan Lin';
    //response.clearCookie('my_name'); //this string mean to kill the cookie right away!
    now = new Date();
    response.cookie('my_name', my_name, {expires: 5000 + now.getTime});//5s the cookie will be killed
    response.send(`Cookie for ${my_name} sent`);
    next();
});

app.get('/use_cookie', function(req, res, next){
    if(typeof req.cookies["my_name"] != 'undefined'){
        res.send(`Hello ${req.cookies["my_name"]} !`);
}else{
    res.send("I dont know you");
}
    next();    
});



var user_data_file = './user_data.json';
if(fs.statSync(user_data_file)){
    var file_stats = fs.statSync(user_data_file);
    var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
}else{
    console.log(`${user_data_file} does not exist!`);
}






app.all('*', function(request, response, next){
    //console.log(request);
    console.log(request.method + ' to ' + request.path);
    next();
});

app.get('/login', function(request, response){
    if( typeof request.session['last_login'] != 'undefined'){
        last_login = 'Last login was ' + request.session['last_login'];
        request.session['last_login'] =  Date();
    }else{
        last_login = 'First time login';
    }
    console.log(request);
    str = `
    <body>
    Last login: ${last_login}
        <br>
        <form action="process_login" method="POST">
            <input type="text" name="uname" size="40" placeholder="username" ><br />
            <input type="password" name="psw" size="40" placeholder="enter password" ><br />
            <input type="submit" value="submit" id="submit">
        </form>
    </body>
    `;
    response.send(str);
});

//*
//*
//*
//*Login process
app.post('/process_login', function (request, response, next) {
    if( typeof request.session['last_login'] != 'undefined'){
        console.log('Last login was ' + request.session['last_login']);
        request.session['last_login'] =  Date();
    }else{
        console.log('First time login');
    }
    request.session['last_login'] =Date();
    let username_entered = request.body["uname"];
    let password_entered = request.body["psw"];
    if(typeof user_data[username_entered] != 'undefined'){
        if(user_data[username_entered]['password'] == password_entered){
            response.send(`Logged in, but not processing the session`);
            //response.redirect('invoice.html?' + qs.stringify(request.query)); 
    }else{
        response.send(`${username_entered} password wrong`);
        }
    }else{
        response.send(`${username_entered} not found`);
    }      
});

app.use(express.static('./static'));

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port)});



