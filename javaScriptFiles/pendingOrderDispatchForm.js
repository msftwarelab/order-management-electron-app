const remote = require("electron").remote;
var orderNo = "";
var partyName = "";
var orderDate = "";
var orderQty = "";

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
    var d = remote.getGlobal('productionStatsID').orderDispatchKey;
    d = d.split("openPendingDispatchButton");
    connection.query("SELECT * from neworder WHERE orderNo = '" + d[1] + "';", function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        loadValuesInPage(results);
    });
}

function loadValuesInPage(data) {
    orderNo = document.getElementById("orderNo").value = data[0].orderNo;
    partyName = document.getElementById("partyName").value = data[0].partyName;
    orderDate = document.getElementById("orderDate").value = data[0].orderDate;
    orderQty = document.getElementById("totalQty").value = data[0].totalQty;
    document.getElementById("orderQtyRow").innerHTML = data[0].totalQty;

    // show values in the first row
    document.getElementById("designName").value = data[0].designName;
    document.getElementById("designNo").value = data[0].designNo;
    document.getElementById("shadeNo").value = data[0].shadeNo;
    document.getElementById("orderQty").value = data[0].orderQty;
    setFinishStockAvailableValue(data[0].designName, data[0].designNo, data[0].shadeNo, "finishStockAvaibility");

    for (var i = 1; i < data.length; i++) {
        console.log(data[i]);
        add_row(data[i]);
    }
}

function add_row(data) {
    var myTable = document.getElementById("data_table");
    var currentIndex = myTable.rows.length;
    var currentRow = myTable.insertRow(currentIndex - 1);

    var designNameBox = document.createElement("input");
    designNameBox.setAttribute("id", "designName" + currentIndex);
    designNameBox.setAttribute("value", data.designName);
    designNameBox.setAttribute("readonly", true);

    var designNoBox = document.createElement("input");
    designNoBox.setAttribute("id", "designNo" + currentIndex);
    designNoBox.setAttribute("value", data.designNo);
    designNoBox.setAttribute("readonly", true);

    var shadeNoBox = document.createElement("input");
    shadeNoBox.setAttribute("id", "shadeNo" + currentIndex);
    shadeNoBox.setAttribute("value", data.shadeNo);
    shadeNoBox.setAttribute("readonly", true);

    var orderQtyBox = document.createElement("input");
    orderQtyBox.setAttribute("id", "orderQty" + currentIndex);
    orderQtyBox.setAttribute("value", data.orderQty);
    orderQtyBox.setAttribute("readonly", true);

    var actualDispatchQtyBox = document.createElement("input");
    actualDispatchQtyBox.setAttribute("type", "number");
    actualDispatchQtyBox.setAttribute("id", "actualDispatchQty" + currentIndex);
    actualDispatchQtyBox.setAttribute("onchange", "return findTotalMeters()");

    var finishStockAvaibilityBox = document.createElement("label");
    finishStockAvaibilityBox.setAttribute("id", "finishStockAvaibility" + currentIndex);
    setFinishStockAvailableValue(data.designName, data.designNo, data.shadeNo, "finishStockAvaibility" + currentIndex);
    finishStockAvaibilityBox.setAttribute("style", "font-size: 15px; color: black;");

    var currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(designNameBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(designNoBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(shadeNoBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(orderQtyBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(actualDispatchQtyBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(finishStockAvaibilityBox);
}

function setFinishStockAvailableValue(dName, dNo, sNo, currentLabelID) {
    connection.query("SELECT qty from openingstock WHERE designName ='" + dName.toUpperCase() + "' AND designNo = '" + dNo.toUpperCase() + "' AND shadeNo = '" + sNo.toUpperCase() + "';", function (error, results, fields) {
        if (error) throw error;
        document.getElementById(currentLabelID).innerHTML = results[0].qty;
    });
}

function findTotalMeters() {
    var table = document.getElementById("data_table");
    var totalM = 0;
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        if (table.rows[r].cells[4].getElementsByTagName("input")[0].value != '') {
            totalM = parseFloat(totalM) + parseFloat(table.rows[r].cells[4].getElementsByTagName("input")[0].value);
        }
    }
    document.getElementById("dispatchQtyRow").innerHTML = totalM.toString();
}

function validateTableValues(table) {
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        if (table.rows[r].cells[4].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[4].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[4].getElementsByTagName("input")[0].style.borderColor = "red";
            return 0;
        }
        else table.rows[r].cells[4].getElementsByTagName("input")[0].style.borderColor = "black";

        var dQty = table.rows[r].cells[4].getElementsByTagName("input")[0].value.trim();
        var sAvailable = table.rows[r].cells[5].getElementsByTagName("label")[0].innerHTML;
        if (parseFloat(dQty) > parseFloat(sAvailable))
            table.rows[r].cells[4].getElementsByTagName("input")[0].style.borderColor = "red";
        else table.rows[r].cells[4].getElementsByTagName("input")[0].style.borderColor = "black";
    }
}

function submitForm() {
    var table = document.getElementById("data_table");

    var dispatchDate = document.getElementById("dispatchDate").value;
    if (dispatchDate == '' || dispatchDate == null) {
        document.getElementById("dispatchDate").style.borderColor = "red";
        return;
    }
    else document.getElementById("dispatchDate").style.borderColor = "black";

    var tempDateArray = dispatchDate.split("-");
    dispatchDate = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];

    if (validateTableValues(table) == 0)
        return;
    var totalDispatchedQty = document.getElementById("dispatchQtyRow").innerHTML;
    // save rest of the entries from the table
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tableDesignName = table.rows[r].cells[0].getElementsByTagName("input")[0].value.trim();
        var tableDesignNo = table.rows[r].cells[1].getElementsByTagName("input")[0].value.trim();
        var tableShadeNo = table.rows[r].cells[2].getElementsByTagName("input")[0].value.trim();
        var tableOrderQty = table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim();
        var tableDispatchQty = table.rows[r].cells[4].getElementsByTagName("input")[0].value.trim();

        connection.query("Insert into dispatchedgoods VALUES ('" + orderNo.toUpperCase() + "','" + partyName.toUpperCase() + "','" + orderDate.toUpperCase() + "','" + dispatchDate.toUpperCase() + "','" + tableDesignName.toUpperCase() + "','" + tableDesignNo.toUpperCase() + "','" + tableShadeNo.toUpperCase() + "','" + tableOrderQty.toUpperCase() + "','" + tableDispatchQty.toUpperCase() + "','" + totalDispatchedQty.toUpperCase() + "','" + "YES" + "');",
            function (err, result) {
                if (err) throw err;
            });
        connection.query("UPDATE openingstock as t1, ( SELECT qty, lockingValue from openingstock where designName = '" + tableDesignName + "' AND designNo = '" + tableDesignNo + "' AND shadeNo = '" + tableShadeNo + "') as t2 set t1.lockingValue = t1.lockingValue - " + tableOrderQty + " , t1.qty = t1.qty - " + tableDispatchQty + " where t1.designName = '" + tableDesignName + "' AND t1.designNo = '" + tableDesignNo + "' AND t1.shadeNo = '" + tableShadeNo + "';",
            function (error, results, fields) {
                if (error) throw error;
            });
    }

    // update dispatch status in dispatchpending table
    connection.query("UPDATE dispatchpending SET dispatchStatus ='" + "YES" + "' WHERE invoiceNo = '" + orderNo + "';", function (error, results, fields) {
        if (error) throw error;
    });
    alert("Goods dispatched. You can close the page.");
}