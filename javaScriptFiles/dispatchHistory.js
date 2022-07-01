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

function fetchValuesForTable() {
    var tableValues = [];
    connection.query('Select distinct invoiceNo, partyName, orderDate, totalDispatchedQty, dispatchDate, dispatchStatus from dispatchedgoods;', function (error, results, fields) {
        if (error) throw error;
        tableValues = results;
        loadValuesInTable(tableValues);
    });
}

function loadValuesInTable(tableValues) {
    var t = "";
    var tableInstance = document.getElementById("dispatchedGoodsBody"), newRow, newCell;
    tableInstance.innerHTML = "";
    for (var i = 0; i < tableValues.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (tableValues[i] instanceof Array) {
        } else {
            if (tableValues[i].dispatchStatus.toUpperCase() == "YES") {
                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].invoiceNo;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].partyName;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].orderDate;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].totalDispatchedQty;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].dispatchDate;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.innerHTML = '<input type="button" onclick="openForm();" value="Open">'
                newRow.appendChild(newCell);
            }

        }
    }
}

