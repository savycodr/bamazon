
// this package will provide the capability to prompt the user from the command line
var inquirer = require("inquirer");

// this package will provide the ability to open connection and talk to database
var mysql = require('mysql');

var Inventory = require("./Inventory");
var inventory = new Inventory();

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
  displayOptions();
});

// This function will display the options to the manager and prompt them to choose one
var displayOptions = function(){

  inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Select your option.",
      choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
              ]
    }
  ]).then(function(result){
    console.log("Hey you chose " + result.option);
    switch(result.option)
    {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewLowInventory();
        break;
      case "Add to Inventory":
        addToInventory();
        break;
      case "Add New Product":
        console.log("4. Add New Product");
        addNewProduct();
        break;
    } // end of switch
  }); // end of then
} // end of display options

// this queries the database and displays inventory
function viewProducts()
{
  // Read the items from the database
  var query = "SELECT  *  FROM  products";
  connection.query(query, function(err, res) {
    printResult(res);
    // end the database connection
    connection.end();
  });
}

// this queries the database and displays items with less than 5 quantity in stock
function viewLowInventory()
{
  // Read the items from the database
  var query = "SELECT  *  FROM  products WHERE stock_qty<5";
  connection.query(query, function(err, res) {
    printResult(res);
    // end the database connection
    connection.end();
  });
}


// This function prints the inventory to the console
function printResult(res){
  for (var i = 0; i < res.length; i++) 
  {
    var item =  res[i].id + 
    ", " + res[i].product_name +
    ", " + res[i].department_name +
    ",  $" + res[i].price +
    ", Quantity: " + res[i].stock_qty;
    console.log(item);
  }
}

// this asks the user to select the item they want to increase inventory
// and what the new stock_qty will be
function addToInventory()
{
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
        message: "Please select the item to add inventory",
        choices: items
      },
      {
        type: "input",
        name: "quantity",
        message: "How many would you like to add?",
        // inquirer expects a true if the answer is valid. If it gets a false, it will continue asking the same question. If it gets a string, it thinks that this is an error message. 
        validate: function validateQty(name){
          var isValid = !isNaN(parseInt(name));
          return isValid || "Quantity should be a number!";
        }
      }
    ])
    .then(function(inquirerResponse) {

      // The item's id will be in the store (this is a primary key)
      var itemID = inquirerResponse.store;
      console.log(itemID);

      // The user's requested quantity (how many they want to buy)
      var requestQty = parseInt(inquirerResponse.quantity);
      console.log(requestQty);

      // now we know the item and the quantity
      // need to see what the current quantity is
      var queryQty = "SELECT  stock_qty, price  FROM  products WHERE ?";
      connection.query(queryQty,  
        {
          id: itemID
        },  function(err1,  resQty) {
          if (err1)
          {
            console.log(err1);
            return err1;
          }
          var stockQty = resQty[0].stock_qty;
          console.log("stock_qty is " + stockQty);

          inventory.modifyQty(connection, itemID, stockQty+requestQty);
      });

    }); // end of prompt
  }); // end f query
} // end of addToInventory

// This function adds a new product to the database (a new row)
function addNewProduct(){
    // Create a "Prompt" to display the store and allow the user to select an item
    inquirer.prompt([
        // Here we display the items in the store
        {
          type: "input",
          name: "name",
          message: "Enter the name of product"
        },
        {
          type: "input",
          name: "department",
          message: "Enter the department of product"
        },
        {
          type: "input",
          name: "price",
          message: "Enter the price of product",
          // inquirer expects a true if the answer is valid. If it gets a false, it will continue asking the same question. If it gets a string, it thinks that this is an error message. 
          validate: function validatePrice(name){
            var isValid = !isNaN(parseInt(name));
            return isValid || "Price should be a number!";
          }
        },
        {
          type: "input",
          name: "quantity",
          message: "Enter the quantity of product",
          // inquirer expects a true if the answer is valid. If it gets a false, it will continue asking the same question. If it gets a string, it thinks that this is an error message. 
          validate: function validateQty(name){
            var isValid = !isNaN(parseInt(name));
            return isValid || "Quantity should be a number!";
          }
        }
      ])
      .then(function(inquirerResponse) {
          console.log("Inserting a new product...\n");
          var query = connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: inquirerResponse.name,
              department_name: inquirerResponse.department,
              price: inquirerResponse.price,
              stock_qty: inquirerResponse.quantity
            },
            function(err, res) {
              if (err)
              {
                console.log(err);
                return err;
              }
              console.log(res.affectedRows + " product inserted!\n");
              // end the database connection
              connection.end();
            }); 
      });       
}


