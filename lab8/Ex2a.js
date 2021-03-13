require("./products_data.js"); 

var num_products = 5;

var item_num = 1;

while(item_num <= num_products)
{
    if(item_num > num_products/2) 
    {
        console.log("That's enought!!!");
        break;
    }
    console.log(`${item_num}. ${eval('name' + item_num)}` );
    item_num++;
}
console.log("That's all we have");