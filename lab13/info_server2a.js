var express = require('express');
var app = express();



app.get('test', function (reques, response, next) {
    response.send('i got a request for /test');
});

app.all('*', function (request, response, next){
    console.log(request.method + 'to path' + request.path + 'with query' + JSON.stringify(request.qurey));
    next();
})

app.listen(8080, function(){
    console.log('listening on port 8080')
});//note the use of an anonyumouse function here