// A constructor that takes a connection to the database and encapsulates 
// the inventory data for the store.
function Inventory(connection){

  // this function will modify the stock_qty in the database
  // connecton is the database connection
  // id is the primary key for the item we will modify
  // newQty is the new quantity that we want in the stock_qty column of the products table
  this.modifyQty = function(connection, id, newQty)
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
}

module.exports = Inventory;
