
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
        console.log("1. view products");
        break;
      case "View Low Inventory":
        console.log("2. View Low Inventory");
        break;
      case "Add to Inventory":
        console.log("3. Add to Inventory");
        break;
      case "Add New Product":
        console.log("4. Add New Product");
        break;
    }
  });
}
