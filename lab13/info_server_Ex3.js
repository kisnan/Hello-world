var express = require('express');
var app = express();
var myParser = require("body-parser"); 
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs');

app.all('*', function (request, response, next) {
   console.log(request.method + ' to path ' + request.path 
   + 'with query' + JSON.stringify(request.query));
    next();
});


app.get('/test', function (request, response, next) {
    response.send('I got a request for /test');
});

app.post('/display_purchase', function (request, response, next) {
    user_data = {'username':'itm352','password':'123'};
    post_data = request.body;
    if(post_data['quantity_textbox']){
        the_qty = post_data['quantity_textbox'];
        if(isNonNegInt(the_qty)){
            qstring = qs.stringify(request.query);
            response.redirect('invoice.html?' + qstring + '&quantity_textbox='+the_qty);
            return;
        }else{
            //response.send(`Hey, ${the_qty} is not a valid quantity`);
            //code above telling valid quantity on the second page
            response.redirect('./order_page.html?quantity_textbox='+the_qty);
            return;
        }
    }
});


app.use(express.static('./public'));

app.listen(8080, function() {
    console.log(`listening on port 8080`)
}
); // note the use of an anonymous function here

function isNonNegInt(q, returnErrors = false){
    if (q=='') q=0;
    var errors = [];
    if(Number(q) !=q) errors.push('Error 404');
    if(q < 0) errors.push('Please input a none negative value!');
    if (parseInt(q) !=q) errors.push('Please input a valet number');

return returnErrors? errors : (errors.length == 0);
}