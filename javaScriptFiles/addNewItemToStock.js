const remote = require("electron").remote;

document.addEventListener("keydown", event => {

    switch (event.key) {
        case "Escape":
            if (remote.getCurrentWindow()) {
                remote.getCurrentWindow().close();
            }
            break;
    }
});

var designName = "";
var design_no = "";
var shade = "";
var qty = 0;
var productionStatusIndex = "";
var inGrey = 0;
var inDyeing = 0;
var productionStatus = "";
var dateOfProduction = "";
var stockAdditionSeries = "";

function initialCheck() {
    if (designName == null || designName == '') {
        document.getElementById('designName').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('designName').style.borderColor = "grey";

    if (design_no == null || design_no == '') {
        document.getElementById('design_no').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('design_no').style.borderColor = "grey"

    if (shade == null || shade == '') {
        document.getElementById('shade').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('shade').style.borderColor = "grey"

    if (qty == null || qty == '') {
        if (qty == 0) {
            document.getElementById('qty').style.borderColor = "grey"
        }
        else {
            document.getElementById('qty').style.borderColor = "red";
            return 0;
        }
    }
    else document.getElementById('qty').style.borderColor = "grey"

    if (productionStatusIndex == "0") {
        document.getElementById('productionStatus').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('productionStatus').style.borderColor = "grey";

    return 1;
}

function submitData() {
    stockAdditionSeries = document.getElementById("stockAdditionSeries").value.trim();
    designName = document.getElementById("designName").value.trim();
    design_no = document.getElementById("design_no").value.trim();
    shade = document.getElementById("shade").value.trim();
    qty = document.getElementById("qty").value.trim();
    inGrey = 0;
    inDyeing = 0;

    productionStatusIndex = document.getElementById("productionStatus").selectedIndex;
    if (parseInt(productionStatusIndex) == 1) {
        inGrey = qty;
        qty = 0;
    }
    else if (parseInt(productionStatusIndex) == 2) {
        inDyeing = qty;
        qty = 0;
    }
    var tempD = document.getElementById("productionStatus");
    productionStatus = tempD.options[tempD.selectedIndex].text.trim();

    dateOfProduction = document.getElementById("dateOfProduction").value;
    var tempDateArray = dateOfProduction.split("-");
    dateOfProduction = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];

    if (initialCheck() == 0)
        return;
    insertValuesIntoNewStockAdditionTable();

    checkForExistenceInDatabase();
    resetPage();

}

function resetPage() {
    alert("Added to the stock!");
    var currentInvoiceNo = parseInt(document.getElementById("stockAdditionSeries").value);
    currentInvoiceNo = currentInvoiceNo + 1;
    connection.query("UPDATE seriesnumber SET seriesValue ='" + currentInvoiceNo + "' WHERE seriesName = 'stockAddition' ", function (error, results, fields) {
        if (error) throw error;
    });
    window.location.reload();
}

function insertValuesIntoNewStockAdditionTable() {
    connection.query("Insert into newstockadditionstatus VALUES ('" + stockAdditionSeries.toUpperCase() + "','" + designName.toUpperCase() + "','" + design_no.toUpperCase() + "','" + shade.toUpperCase() + "','" + qty + "','" + inGrey + "','" + inDyeing + "','" + dateOfProduction + "','" + productionStatus.toUpperCase() + "')",
        function (err, result) {
            if (err) throw err;
            console.log("Insert query", result);
        });
}

function checkForExistenceInDatabase() {
    connection.query("SELECT qty, inGrey, inDyeing from openingstock where designName ='" + designName.toUpperCase() + "' AND designNo = '" + design_no.toUpperCase() + "' AND shadeNo='" + shade.toUpperCase() + "';", function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        decisionToSaveNewOrEditExisting(results);
    });
}

function decisionToSaveNewOrEditExisting(results) {
    console.log("Qty=" + qty, " Grey=" + inGrey, " Dyeing=" + inDyeing);
    // first check if the same value exists in the database or no?
    if (results.length == 0) {
        connection.query("Insert into openingstock VALUES ('" + designName.toUpperCase() + "','" + design_no.toUpperCase() + "','" + shade.toUpperCase() + "','" + '0' + "','" + qty + "','" + inGrey + "','" + inDyeing + "','" + "0" + "')",
            function (err, result) {
                if (err) throw err;
                console.log("Insert query", result);
            });
    }
    else {
        inGrey = parseFloat(inGrey) + parseFloat(results[0].inGrey)
        inDyeing = parseFloat(inDyeing) + parseFloat(results[0].inDyeing)
        qty = parseFloat(qty) + parseFloat(results[0].qty)
        console.log("Qty=" + qty, " Grey=" + inGrey, " Dyeing=" + inDyeing, "Updated");

        //update existing value in the db
        connection.query("UPDATE openingstock SET qty = '" + qty + "', inGrey ='" + inGrey + "', inDyeing ='" + inDyeing + "' WHERE designName = '" + designName.toUpperCase() + "' AND designNo= '" + design_no.toUpperCase() + "' AND shadeNo = '" + shade.toUpperCase() + "';",
            function (err, result) {
                if (err) throw err;
                console.log("Update query", result);
            });
    }
}