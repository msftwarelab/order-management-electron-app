
var previousDesignName = "";
var previousDesignNo = "";

function addValuesToDatabase() {
    if (validatePage() == 0)
        return;

    var dName = document.getElementById("designName").value.trim();
    var dNo = document.getElementById("design_no").value.trim();
    var sh = document.getElementById("shade").value.trim();
    var pcs = document.getElementById("pcs").value.trim();
    var quantity = document.getElementById("quantity").value.trim();

    connection.query("Insert into openingstock VALUES ('" + dName.toUpperCase() + "','" + dNo.toUpperCase() + "','" + sh.toUpperCase() + "','" + pcs + "','" + quantity + "','" + "0" + "','" + "0" + "','" + "0" + "')",
        function (err, result) {
            if (err) throw err;
            //console.log(result);
        });
    loadMyValues();
}

function loadMyValues() {
    connection.query('SELECT * from openingstock ORDER BY designName, designNo, shadeNo', function (error, results, fields) {
        if (error) throw error;
        dbOpeningStockValues = results;
        loadValuesInTable(dbOpeningStockValues);
        clearValuesInForm();
    });
}

function clearValuesInForm() {
    document.getElementById("designName").value = null;
    document.getElementById("design_no").value = null;
    document.getElementById("shade").value = null;
    document.getElementById("pcs").value = null;
    document.getElementById("quantity").value = null;
}

function loadValuesInTable(dbOpeningStockValues) {
    var t = "";
    var tableInstance = document.getElementById("stockTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";

    for (var i = 0; i < dbOpeningStockValues.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (dbOpeningStockValues[i] instanceof Array) {
           // console.log("andar aaya?");
        } else {
            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].designName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].designNo;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].shadeNo;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].pcs;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = dbOpeningStockValues[i].qty;
            newRow.appendChild(newCell);
        }
    }
}

// function checkPreviousDesignValue(value) {
//     if (value == previousDesignName)
//         return null;
//     else {
//         previousDesignName = value;
//         return previousDesignName;
//     }
// }

// function checkPreviousDesignNoValue(value) {
//     if (value == previousDesignNo)
//         return null;
//     else {
//         previousDesignNo = value;
//         return previousDesignNo;
//     }
// }

function myFunction() {
    // Declare variables 
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        for (j = 0; j <= 4; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            //console.log(td);
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}
function validatePage() {
    if (document.getElementById('designName').value == null || document.getElementById('designName').value == '') {
        document.getElementById('designName').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('designName').style.borderColor = "grey";

    if (document.getElementById('design_no').value == null || document.getElementById('design_no').value == '') {
        document.getElementById('design_no').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('design_no').style.borderColor = "grey";

    if (document.getElementById('shade').value == null || document.getElementById('shade').value == '') {
        document.getElementById('shade').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('shade').style.borderColor = "grey";

    if (document.getElementById('quantity').value == null || document.getElementById('quantity').value == '') {
        document.getElementById('quantity').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('quantity').style.borderColor = "grey"
}