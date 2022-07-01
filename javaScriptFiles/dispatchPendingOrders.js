const remote = require("electron").remote;
let pendingOrderDispatchForm;
const electron = require('electron').remote;
const { BrowserWindow } = electron;

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
    connection.query('Select distinct invoiceNo, firmName, orderDate, totalOrderQty, dispatchStatus from dispatchpending;', function (error, results, fields) {
        if (error) throw error;
        tableValues = results;
        loadValuesInTable(tableValues);
    });
}


function loadValuesInTable(tableValues) {
    var t = "";
    var tableInstance = document.getElementById("dispatchTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";
    console.log(tableValues);
    for (var i = 0; i < tableValues.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (tableValues[i] instanceof Array) {
        } else {
            if (tableValues[i].dispatchStatus.toUpperCase() == "NO") {
                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].invoiceNo;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].firmName;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].orderDate;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].totalOrderQty;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].dispatchStatus;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                var btn = document.createElement('input');
                btn.type = "button";
                btn.id = "openPendingDispatchButton" + tableValues[i].invoiceNo;
                btn.value = "Open";
                btn.onclick = (function () {
                    return function () {
                        changeStatus(this.id);
                    }
                })();
                newRow.appendChild(newCell);
                newCell.appendChild(btn);
            }
        }
    }
}

function changeStatus(btId) {
    remote.getGlobal('productionStatsID').orderDispatchKey = btId;
    console.log(remote.getGlobal('productionStatsID').orderDispatchKey, "Global");
    pendingOrderDispatchForm = new BrowserWindow({
        width: 1000, //do 700 later on
        height: 575,
        minimizable: false,
        maximizable: false,
        closable: true,
        frame: false,
        resizable: false,
        globals: { id: btId }
    });

    let url = require('url').format({
        protocol: 'file',
        slashes: true,
        pathname: require('path').join(__dirname, '../webFiles/pendingOrderDispatchForm.html')
    })

    pendingOrderDispatchForm.loadURL(url)
    pendingOrderDispatchForm.setMenu(null);
    //pendingOrderDispatchForm.webContents.openDevTools();
}