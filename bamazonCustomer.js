// this package will provide the capability to prompt the user from the command line
var inquirer = require("inquirer");

// this package will provide the ability to open connection and talk to database
var mysql = require('mysql');

// create a database connection to the database bamazon
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    // database name
    database: "bamazon"
  });

// Connect to the database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayStore();
});

// This function will display the store to the user and prompt them to make a purchase
var displayStore = function(){

  // Read the items from the database
  var query = "SELECT  *  FROM  products";
  connection.query(query, function(err, res) {
    var items = [];
    // populate the items for display on the commandline
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].product_name);
      var item = "Item: " + res[i].product_name + " Price: $" + res[i].price;
      // The format for the object to be passed into the inquirer prompt choice
      // needs to be in the format of name: value:
      // Where name is what will be displayed to the user
      // and value is what data will be be stored upon selection
      var itemsObj = {
        value: res[i].id,
        name: item
      }
      // items.push(itemsObj);
      items.push(itemsObj);
    } // end of for loop

    // Create a "Prompt" to display the store and allow the user to select an item
    inquirer.prompt([
      // Here we display the items in the store
      {
        type: "list",
        name: "store",
        message: "Welcome to Bamazon",
        choices: items
      }
    ])
    .then(function(inquirerResponse) {

      // The item's id will be in the store (this is a primary key)
      var itemID = inquirerResponse.store;
      console.log(itemID);
      promptQuantity(itemID);

    }); // end of item prompt
  }); // end of database query for product select
} // end of displayStore

// this function prompts the user for the amount of an item they wish to purchase
// id is the primary key for the item 
function promptQuantity(id)
{
  // Create a "Prompt" to ask how many of the item they want to buy.
  inquirer.prompt([
    {
      type: "input",
      name: "quantity",
      message: "How many would you like to buy?",
      // inquirer expects a true if the answer is valid. If it gets a false, it will continue asking the same question. If it gets a string, it thinks that this is an error message. 
      validate: function validateQty(name){
        var isValid = !isNaN(parseInt(name));
        return isValid || "Quantity should be a number!";
      }
    }
  ])
  .then(function(inquirerResponseQty) {

    // The user's requested quantity (how many they want to buy)
    var requestQty = parseInt(inquirerResponseQty.quantity);
    console.log(requestQty);
    // now we know the item and the quantity
    // need to see if we have enough quantity
    var queryQty = "SELECT  stock_qty, price  FROM  products WHERE ?";
    connection.query(queryQty,  
      {
        id: id
      },  function(err1,  resQty) {
        if (err1)
        {
          console.log(err1);
          return err1;
        }
        var stockQty = resQty[0].stock_qty;
        console.log("stock_qty is " + stockQty);
        // If we don't have enough stock
        if (stockQty<requestQty)
        {
          // prompt the user to enter a new quantity
          // make a recursive call to promptQuantity
          console.log("I'm sorry, we only have " +  stockQty + " in stock.");
          promptQuantity(id)
        } else{
          // If we do we need to update the database with a new lower quantity
          // and display the total cost to the user
          var price = resQty[0].price;
          price = price * requestQty;
          console.log("Your purchase will cost $" + price);
          modifyQty(id, stockQty-requestQty);
        }
      });

    }); // end of the quantity prompt
}


// this function will modify the stock_qty in the database
// id is the primary key for the item we will modify
// newQty is the new quantity that we want in the stock_qty column of the products table
function modifyQty(id, newQty)
{
    console.log("Updating quantities...\n");
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_qty: newQty
        },
        {
          id: id
        }
      ],
      function(err, res) {
        if (err){
          console.log(err);
          return(err);
        }
        console.log(res.affectedRows + " products updated!\n");
        // end the database connection
        connection.end();
      });
}