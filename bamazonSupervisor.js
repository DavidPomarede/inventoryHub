var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

var requestedID;
var requestedQuantity;
var addedQuantity;

console.log("\n\n                        W E L C O M E   T O                                     ");
console.log("                                                                                ");
console.log(":::::::::      :::     ::::    ::::      :::     ::::::::: ::::::::  ::::    :::");
console.log(":+:    :+:   :+: :+:   +:+:+: :+:+:+   :+: :+:        :+: :+:    :+: :+:+:   :+:");
console.log("+:+    +:+  +:+   +:+  +:+ +:+:+ +:+  +:+   +:+      +:+  +:+    +:+ :+:+:+  +:+");
console.log("+#++:++#+  +#++:++#++: +#+  +:+  +#+ +#++:++#++:    +#+   +#+    +:+ +#+ +:+ +#+");
console.log("+#+    +#+ +#+     +#+ +#+       +#+ +#+     +#+   +#+    +#+    +#+ +#+  +#+#+#");
console.log("#+#    #+# #+#     #+# #+#       #+# #+#     #+#  #+#     #+#    #+# #+#   #+#+#");
console.log("#########  ###     ### ###       ### ###     ### ######### ########  ###    ####");
console.log("                                                                                ");
console.log("                        S U P E R V I S O R   P O R T A L                           \n\n");


connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Departments",
                "Create New Department",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
            case "View Departments":
                viewDepartments();
                break;

            case "Create New Department":
                addNew();
                break;

            case "Exit":
                connection.end();
                break;
            }
        });
}






// make an array here and populate with each departent as an object, 
// but make this a simplified SELECT * FROM search

// then match category names with category names in products
// collect the total sales in a variable,
// then push the variables to an array

//SELECT * FROM bamazon.departments;


//     connection.query("SELECT * FROM bamazon.departments", function(err, res) {
//         if (err) throw err;
//         for (var i = 0; i < res.length; i++) {
//             console.log();
//         }
//         runSearch();
//     });









function viewDepartments() {
    connection.query("SELECT * FROM departments", 
    function(err, res) {
        if (err) throw err;
        var data = [];





        for (var i = 0; i < res.length; i++) {
            var tableRow;

            // department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
            // department_name VARCHAR(30) NOT NULL,
            // over_head_costs DECIMAL(10, 2) NULL,
            // gross_sales

            var tableRowTotal = res[i].gross_sales - res[i].over_head_costs;

            tableRow = {"id": res[i].department_id, "name": res[i].department_name, "oh": res[i].over_head_costs, "sales": res[i].gross_sales, "profit": tableRowTotal};
            data.push(tableRow);
        }

        // SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales
        // FROM departments
        // INNER JOIN products ON products.department_name = departments.department_name;


// CREATING THE TABLE BELOW:
        console.log("\n\n");
        var t = new Table;
        data.forEach(function(dept) {
            t.cell('Dept. Id', dept.id)
            t.cell('Dept. Name', dept.name)
            t.cell('Overhead', dept.oh)
            t.cell('Product Sales', dept.sales)
            t.cell('Total Profit', dept.profit, Table.number(2))
            t.newRow()
        })
        console.log(t.toString());
        console.log("\n\n");
        runSearch();
    });
}


function addNew() {
    inquirer
        .prompt([
        {
            name: "department_name",
            type: "input",
            message: "What is the name of the new department you would like to add?"
        },
        {
            name: "over_head_costs",
            type: "input",
            message: "How much are overhead costs for this department?"
        }
        ])
        .then(function(answer) {
            connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: answer.department_name,
                over_head_costs: answer.over_head_costs,
		gross_sales: 0
            },
            function(err) {
                if (err) throw err;
                console.log("Your department listing was created successfully!");
                runSearch();
            }
            );
        });
};



// function viewLowInventory() {
//     connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
//         if (err) throw err;
//         for (var i = 0; i < res.length; i++) {
//             console.log(
//                 "Item: " +
//                 res[i].product_name +
//                 "Quantity: " +
//                 res[i].stock_quantity
//             );
//         }
//         runSearch();
//     });
// }

// function promptAddInventory() {
//     connection.query("SELECT * FROM products", function(err, res) {
//         if (err) throw err;
//         console.log("\n\nID | NAME |  DEPT.  | QUANT. | PRICE");        
//         console.log("-----------------------------------");
//         for (var i = 0; i < res.length; i++) {
//             console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].stock_quantity + " | $" + res[i].price);
//         }
//         console.log("-----------------------------------\n");
//     });

//     inquirer
//     .prompt([
//             {
//             type: "input",
//             message: "Please enter the ID number of the product that you would like to add to the inventory: ",
//             name: "productID",
//             validate: function(value) {
//                 if (isNaN(value) === false) {
//                     return true;
//                 }
//                 return false;
//                 }
//             },
//     ])
//     .then(function(answer1) {
//         requestedID = answer1.productID;

//         connection.query("SELECT * FROM products WHERE ?", { id: requestedID }, function(err, res) {
//             if (err) throw err;
//             for (var i = 0; i<res.length; i++) {
//                 requestedQuantity = res[i].stock_quantity;
//             }


//         });
//         addInventory();
//     });
// };

// function addInventory() {

//     inquirer
//     .prompt([
//         {
//             type: "input",
//             message: "How many units would you like to add?",
//             name: "added_units",
//             validate: function(value) {
//                 if (isNaN(value) === false) {
//                     return true;
//                 }
//                 return false;
//             }
//         },
//     ])
//     .then(function(answer2) {

//         var addQuantity = answer2.added_units;
//         var total = parseInt(requestedQuantity) + parseInt(addQuantity);

//         connection.query(
//             "UPDATE products SET ? WHERE ?",
//             [
//                 {
//                 stock_quantity: total
//                 },
//                 {
//                 id: requestedID
//                 }
//             ],
//             function(error) {
//                 // if (error) throw err;
//                 console.log("You added " + addQuantity + " of these items!");
//                 runSearch();
//             }
//         );
//     });
// };


