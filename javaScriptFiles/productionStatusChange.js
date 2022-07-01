const remote = require("electron").remote;
var stockAdditionSeries = "";
var designName = "";
var designNo = "";
var shadeNo = "";
var finishQty = "";
var greyQty = "";
var dyeingQty = "";
var dateOfMfg = "";
var currentStatus = "";
var uppperLimit = 0;
var qty_n = "";
var productionStatus_n_index = "";
var productionStatus_n = "";
var statusChangeDate_n = "";
var currentSeries = "";
var globQtyWithSameStatus = "0";

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "Escape":
            if (remote.getCurrentWindow()) {
                remote.getCurrentWindow().close();
            }
            break;
    }
});

function loadPageBody() {
    var d = remote.getGlobal('productionStatsID').prodOne;
    d = d.split("changeStatusButton");
    connection.query("SELECT * from newstockadditionstatus WHERE stockAdditionSeries = '" + d[1] + "';", function (error, results, fields) {
        if (error) throw error;
        loadValuesInPage(results[0]);
    });
    connection.query("SELECT seriesValue from seriesnumber WHERE seriesName = 'stockAddition' ", function (error, results, fields) {
        if (error) throw error;
        currentSeries = results[0].seriesValue;
    });
}

function loadValuesInPage(data) {
    document.getElementById("stockAdditionSeries").value = data.stockAdditionSeries;
    document.getElementById("dateOfMfg").value = data.dateOfMfg;
    document.getElementById("currentStatus").value = data.currentStatus;
    document.getElementById("designName").value = data.designName;
    document.getElementById("designNo").value = data.designNo;
    document.getElementById("shadeNo").value = data.shadeNo;
    document.getElementById("qty").value = 0;
    if (data.currentStatus == "Finished" || data.currentStatus == "FINISHED") {
        document.getElementById("qty").value = data.finishQty;
    } else if (data.currentStatus == "In Dyeing" || data.currentStatus == "IN DYEING") {
        document.getElementById("qty").value = data.dyeingQty;
    } else if (data.currentStatus == "Grey" || data.currentStatus == "GREY") {
        document.getElementById("qty").value = data.greyQty;
    }
    uppperLimit = parseFloat(document.getElementById("qty").value);
    document.getElementById("remaining_meters_text").innerHTML = "Total mtrs left : " + data.currentStatus;
    document.getElementById("remaining_meters").innerHTML = uppperLimit;
}

function add_row(argument) {
    qty_n = document.getElementById("qty_n").value;
    var myTable = document.getElementById("data_table");
    productionStatus_n_index = document.getElementById("productionStatus_n").selectedIndex;
    var orderDate = document.getElementById("statusChangeDate_n").value;

    if (initialCheck(qty_n, productionStatus_n_index, orderDate) == 0)
        return;
    if (checkTableContentForEmpty(myTable) == 0)
        return;
    
    var currentIndex = myTable.rows.length;
    var currentRow = myTable.insertRow(currentIndex - 1);

    var qtyBox = document.createElement("input");
    qtyBox.setAttribute("type", "number");
    qtyBox.setAttribute("id", "qty_n" + currentIndex);
    qtyBox.setAttribute("onchange", "checkQuantity()");

    var productionStatusDropdown = document.createElement("select");
    productionStatusDropdown.setAttribute("id", "productionStatus_n" + currentIndex);
    productionStatusDropdown.setAttribute("value", "Design No");
    productionStatusDropdown.setAttribute("class", "browser-default");
    productionStatusDropdown.setAttribute("onchange", "setGlobalParam(this.id, this.value)");

    for (var i = 0; i <= 3; i++) {
        var produuctionStatusOption = document.createElement("option");
        if (i == 0) {
            produuctionStatusOption.value = "" + currentIndex;
            produuctionStatusOption.text = "Production Status";
            produuctionStatusOption.disabled = true;
            produuctionStatusOption.selected = true;
        } else if (i == 1) {
            produuctionStatusOption.value = "1" + currentIndex;
            produuctionStatusOption.text = "GREY";
        } else if (i == 2) {
            produuctionStatusOption.value = "2" + currentIndex;
            produuctionStatusOption.text = "IN DYEING";
        } else if (i == 3) {
            produuctionStatusOption.value = "3" + currentIndex;
            produuctionStatusOption.text = "FINISHED";
        }
        productionStatusDropdown.appendChild(produuctionStatusOption);
    }

    var statusChangeDate = document.createElement("input");
    statusChangeDate.setAttribute("type", "date");
    statusChangeDate.setAttribute("name", "statusChangeDate_n" + currentIndex);

    var addRowBox = document.createElement("input");
    addRowBox.setAttribute("type", "button");
    addRowBox.setAttribute("value", "Add Row");
    addRowBox.setAttribute("onclick", "add_row();");
    addRowBox.setAttribute("class", "button");

    var addDeleteBox = document.createElement("input");
    addDeleteBox.setAttribute("type", "button");
    addDeleteBox.setAttribute("value", "Delete");
    addDeleteBox.setAttribute("id", "deleteButton" + currentIndex);
    addDeleteBox.setAttribute("onclick", "delete_row(this);");
    addDeleteBox.setAttribute("class", "button");

    var currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(qtyBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(productionStatusDropdown);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(statusChangeDate);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(addRowBox);

    currentCell.appendChild(addDeleteBox);
}

function delete_row(rows) {
    var _row = rows.parentElement.parentElement;
    var tempButtonId = rows.id.split("deleteButton");
    if (document.getElementById("qty_n" + tempButtonId[1]).value.trim != "" || document.getElementById("qty_n" + tempButtonId[1]).value.trim != null) {
        globQtyWithSameStatus = parseFloat(globQtyWithSameStatus) - parseFloat(document.getElementById("qty_n" + tempButtonId[1]).value);
    }
    document.getElementById('data_table').deleteRow(_row.rowIndex);
    checkQuantity();
}

function checkQuantity() {
    var table = document.getElementById("data_table");
    var totalM = uppperLimit;
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        if (table.rows[r].cells[0].getElementsByTagName("input")[0].value != '') {
            totalM = parseFloat(totalM) - parseFloat(table.rows[r].cells[0].getElementsByTagName("input")[0].value);
        }
    }
    document.getElementById("remaining_meters").innerHTML = totalM.toString();

    if (parseFloat(document.getElementById('remaining_meters').innerText) < 0) {
        document.getElementById('remaining_meters').style.color = "red";
        return 0;
    }
    else document.getElementById('remaining_meters').style.color = "black";
}

function initialCheck(qtY, productionS, prodDate) {
    if (parseFloat(document.getElementById('remaining_meters').innerText) < 0) {
        document.getElementById('remaining_meters').style.color = "red";
        return 0;
    }
    else document.getElementById('remaining_meters').style.color = "black";

    if (qtY == null || qtY == '' || parseFloat(qtY) <= 0) {
        document.getElementById('qty_n').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('qty_n').style.borderColor = "grey";

    if (productionS == "0") {
        document.getElementById('productionStatus_n').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('productionStatus_n').style.borderColor = "grey";

    if (prodDate == null || prodDate == '') {
        document.getElementById('statusChangeDate_n').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('statusChangeDate_n').style.borderColor = "grey";

    return 1;
}


function checkTableContentForEmpty(table) {
    for (var r = 2, n = table.rows.length - 1; r < n; r++) {
        //qty
        if (table.rows[r].cells[0].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[0].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[0].getElementsByTagName("input")[0].style.borderColor = "red";
            return 0;
        }
        else table.rows[r].cells[0].getElementsByTagName("input")[0].style.borderColor = "grey";

        //production status dropdown
        if (table.rows[r].cells[1].getElementsByTagName("select")[0].selectedIndex == "0") {
            table.rows[r].cells[1].getElementsByTagName("select")[0].style.borderColor = "red";
            return 0;
        }
        else table.rows[r].cells[1].getElementsByTagName("select")[0].style.borderColor = "grey";

        //date
        if (table.rows[r].cells[2].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[0].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[2].getElementsByTagName("input")[0].style.borderColor = "red";
            return 0;
        }
        else table.rows[r].cells[2].getElementsByTagName("input")[0].style.borderColor = "grey";
    }
    return 1;
}

function submitForm() {
    // validations
    stockAdditionSeries = document.getElementById("stockAdditionSeries").value.trim();
    dateOfMfg = document.getElementById("dateOfMfg").value.trim();
    currentStatus = document.getElementById("currentStatus").value.trim();
    designName = document.getElementById("designName").value.trim();
    designNo = document.getElementById("designNo").value.trim();
    shadeNo = document.getElementById("shadeNo").value.trim();
    qty = document.getElementById("qty").value.trim();
    var table = document.getElementById("data_table");

    var changeQty = document.getElementById("qty_n").value.trim();
    productionStatus_n_index = document.getElementById("productionStatus_n").selectedIndex;
    var tempD = document.getElementById("productionStatus_n");
    var productionStatus_n = tempD.options[tempD.selectedIndex].text.trim();

    var changeStatusDate = document.getElementById("statusChangeDate_n").value;

    var tempDateArray = changeStatusDate.split("-");
    if (tempDateArray != "")
        changeStatusDate = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];
    
    if (initialCheck(changeQty, productionStatus_n, changeStatusDate) == 0)
        return;
    if (checkTableContentForEmpty(table) == 0)
        return;
    
    if (productionStatus_n == "Grey" || productionStatus_n == "GREY") {
        greyQty = changeQty;
        dyeingQty = "0";
        finishQty = "0";
    } else if (productionStatus_n == "In Dyeing" || productionStatus_n == "IN DYEING") {
        greyQty = "0";
        dyeingQty = changeQty;
        finishQty = "0";
    } else if (productionStatus_n == "Finished" || productionStatus_n == "FINISHED") {
        greyQty = "0";
        dyeingQty = "0";
        finishQty = changeQty;
    }
    
    // insert the new change in the newstockadditionstatus table with different ID but before that fetch production series from seriesvalue
    //Save first entry
    connection.query("Insert into newstockadditionstatus VALUES ('" + currentSeries + "','" + designName.toUpperCase() + "','" + designNo.toUpperCase() + "','" + shadeNo.toUpperCase() + "','" + finishQty.toUpperCase() + "','" + greyQty.toUpperCase() + "','" + dyeingQty.toUpperCase() + "','" + changeStatusDate.toUpperCase() + "','" + productionStatus_n.toUpperCase() + "')",
        function (err, result) {
            if (err) throw err;
        });
    // save rest of the entries from the table
    for (var r = 2, n = table.rows.length - 1; r < n; r++) {
        currentSeries = parseFloat(currentSeries) + 1;
        var tableChangeQty = table.rows[r].cells[0].getElementsByTagName("input")[0].value.trim();
        var tempF = table.rows[r].cells[1].getElementsByTagName("select")[0];
        var tableChangeStatus = tempF.options[tempF.selectedIndex].text.trim();
        var changeTableStatusDate = table.rows[r].cells[2].getElementsByTagName("input")[0].value.trim();
        var tempTableDateArray = changeTableStatusDate.split("-");
        changeTableStatusDate = tempTableDateArray[2] + "-" + tempTableDateArray[1] + "-" + tempTableDateArray[0];
        var greyQty_n = "0";
        var dyeingQty_n = "0";
        var finishQty_n = "0";

        if (tableChangeStatus == "Grey" || tableChangeStatus == "GREY") {
            greyQty_n = tableChangeQty;
        } else if (tableChangeStatus == "In Dyeing" || tableChangeStatus == "IN DYEING") {
            dyeingQty_n = tableChangeQty;
        } else if (tableChangeStatus == "Finished" || tableChangeStatus == "FINISHED") {
            finishQty_n = tableChangeQty;
        }
        connection.query("Insert into newstockadditionstatus VALUES ('" + currentSeries.toString() + "','" + designName.toUpperCase() + "','" + designNo.toUpperCase() + "','" + shadeNo.toUpperCase() + "','" + finishQty_n.toUpperCase() + "','" + greyQty_n.toUpperCase() + "','" + dyeingQty_n.toUpperCase() + "','" + changeTableStatusDate.toUpperCase() + "','" + tableChangeStatus.toUpperCase() + "')",
            function (err, result) {
                if (err) throw err;
            });
    }
    
    //increment production series in the series value table
    currentSeries = parseFloat(currentSeries) + 1;
    connection.query("UPDATE seriesnumber SET seriesValue ='" + currentSeries + "' WHERE seriesName = 'stockAddition' ", function (error, results, fields) {
        if (error) throw error;
    });
    
    //reduce the meters from current entry in newstockadditionstatus against production series ID
    var greyQty_O = "0";
    var dyeingQty_O = "0";
    var finishQty_O = "0";

    if (currentStatus == "Grey" || currentStatus == "GREY") {
        greyQty_O = document.getElementById("remaining_meters").innerHTML;
    } else if (currentStatus == "In Dyeing" || currentStatus == "IN DYEING") {
        dyeingQty_O = document.getElementById("remaining_meters").innerHTML;
    } else if (currentStatus == "Finished" || currentStatus == "FINISHED") {
        finishQty_O = document.getElementById("remaining_meters").innerHTML;
    }

    connection.query("UPDATE newstockadditionstatus SET finishQty ='" + finishQty_O + "', greyQty ='" + greyQty_O + "',dyeingQty ='" + dyeingQty_O + "' WHERE stockAdditionSeries = '" + stockAdditionSeries + "'", function (error, results, fields) {
        if (error) throw error;
    });
    
    // fetch values from stock table first then alter
    connection.query("SELECT * from openingstock WHERE designName = '" + designName + "' AND designNo ='" + designNo + "' AND shadeNo ='" + shadeNo + "';", function (error, results, fields) {
        if (error) throw error;
        alterValueInStock(results[0]);
    });
}

function alterValueInStock(data) {
    var greyQty_U = "0";
    var dyeingQty_U = "0";
    var finishQty_U = "0";
    var table = document.getElementById("data_table");
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {

        var tableChangeQty = table.rows[r].cells[0].getElementsByTagName("input")[0].value.trim();
        var tempF = table.rows[r].cells[1].getElementsByTagName("select")[0];
        var tableChangeStatus = tempF.options[tempF.selectedIndex].text.trim();

        if (tableChangeStatus == "Grey" || tableChangeStatus == "GREY") {
            greyQty_U = parseFloat(tableChangeQty) + parseFloat(greyQty_U);
        } else if (tableChangeStatus == "In Dyeing" || tableChangeStatus == "IN DYEING") {
            dyeingQty_U = parseFloat(tableChangeQty) + parseFloat(dyeingQty_U);
        } else if (tableChangeStatus == "Finished" || tableChangeStatus == "FINISHED") {
            finishQty_U = parseFloat(tableChangeQty) + parseFloat(finishQty_U);
        }
    }
    var greyQty_O = "";
    var dyeingQty_O = "";
    var finishQty_O = "";

    if (currentStatus == "Grey" || currentStatus == "GREY") {
        greyQty_O = parseFloat(data.inGrey) + parseFloat(greyQty_U) - parseFloat(dyeingQty_U) - parseFloat(finishQty_U);
        dyeingQty_O = parseFloat(data.inDyeing) + parseFloat(dyeingQty_U);
        finishQty_O = parseFloat(data.qty) + parseFloat(finishQty_U);
    } else if (currentStatus == "In Dyeing" || currentStatus == "IN DYEING") {
        greyQty_O = parseFloat(data.inGrey) + parseFloat(greyQty_U);
        dyeingQty_O = parseFloat(data.inDyeing) + parseFloat(dyeingQty_U) - parseFloat(greyQty_U) - parseFloat(finishQty_U);
        finishQty_O = parseFloat(data.qty) + parseFloat(finishQty_U);
    } else if (currentStatus == "Finished" || currentStatus == "FINISHED") {
        greyQty_O = parseFloat(data.inGrey) + parseFloat(greyQty_U);
        dyeingQty_O = parseFloat(data.inDyeing) + parseFloat(dyeingQty_U);
        finishQty_O = parseFloat(data.qty) + parseFloat(finishQty_U) - parseFloat(dyeingQty_U) - parseFloat(greyQty_U);
    }
    connection.query("UPDATE openingstock SET inGrey ='" + greyQty_O + "', inDyeing = '" + dyeingQty_O + "', qty = '" + finishQty_O + "'WHERE designName = '" + designName.toUpperCase() + "' AND designNo = '" + designNo.toUpperCase() + "' AND shadeNo = '" + shadeNo.toUpperCase() + "';", function (error, results, fields) {
        if (error) throw error;
    });
    alert("Values are upated! You can close this page");
}

function setGlobalParam(cuContext, val) {
    var tempStatus = "";
    val = val.substring(0, 1);
    if (val == "1")
        tempStatus = "GREY";
    else if (val == "2")
        tempStatus = "IN DYEING";
    else if (val == "3")
        tempStatus = "FINISHED";
    if (tempStatus == document.getElementById("currentStatus").value) {
        var tempStatusArray = cuContext.split("productionStatus_n");
        globQtyWithSameStatus = parseFloat(globQtyWithSameStatus) + parseFloat(document.getElementById("qty_n" + tempStatusArray[1]).value);
    }
}