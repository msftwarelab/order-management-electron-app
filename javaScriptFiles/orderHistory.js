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
    connection.query('Select distinct orderNo, partyName, orderDate, totalQty from newOrder;', function (error, results, fields) {
        if (error) throw error;
        tableValues = results;
        loadValuesInTable(tableValues);
    });
}

function loadValuesInTable(tableValues) {
    var t = "";
    var tableInstance = document.getElementById("orderTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";
    console.log(tableValues);
    for (var i = 0; i < tableValues.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (tableValues[i] instanceof Array) {
        } else {
            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].orderNo;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].partyName;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].orderDate;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].totalQty;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.innerHTML = '<input type="button" onclick="openForm();" value="Open">'
            newRow.appendChild(newCell);
        }
    }
}

