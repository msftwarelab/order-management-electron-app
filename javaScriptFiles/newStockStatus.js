const remote = require("electron").remote;
let newStockAdditionStatus;

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

function changeStatus(btId) {
    remote.getGlobal('productionStatsID').prodOne = btId;
    newStockAdditionStatus = new BrowserWindow({
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
        pathname: require('path').join(__dirname, '../webFiles/productionStatusChanges.html')
    })

    newStockAdditionStatus.loadURL(url)
    newStockAdditionStatus.setMenu(null);
    //newStockAdditionStatus.webContents.openDevTools();
}

function fetchValuesForTable() {
    var tableValues = [];
    connection.query('Select * from newstockadditionstatus ORDER BY stockAdditionSeries DESC;', function (error, results, fields) {
        if (error) throw error;
        tableValues = results;
        loadValuesInTable(tableValues);
    });
}

function loadValuesInTable(tableValues) {
    var t = "";
    var tableInstance = document.getElementById("productionTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";
    for (var i = 0; i < tableValues.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (tableValues[i] instanceof Array) {
        } else {
            if (tableValues[i].finishQty > 0 || tableValues[i].greyQty > 0 || tableValues[i].dyeingQty > 0) {
                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].stockAdditionSeries;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].designName;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].designNo;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].shadeNo;
                newRow.appendChild(newCell);

                if (parseFloat(tableValues[i].finishQty) > 0) {
                    newCell = document.createElement("td");
                    newCell.textContent = tableValues[i].finishQty;
                    newRow.appendChild(newCell);
                } else if (parseFloat(tableValues[i].greyQty) > 0) {
                    newCell = document.createElement("td");
                    newCell.textContent = tableValues[i].greyQty;
                    newRow.appendChild(newCell);
                } else if (parseFloat(tableValues[i].dyeingQty) > 0) {
                    newCell = document.createElement("td");
                    newCell.textContent = tableValues[i].dyeingQty;
                    newRow.appendChild(newCell);
                }

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].dateOfMfg;
                newRow.appendChild(newCell);

                if (tableValues[i].currentStatus == "Finished" || tableValues[i].currentStatus == "FINISHED") {
                    newRow.style.background = "LightBlue";
                } else if (tableValues[i].currentStatus == "In Dyeing" || tableValues[i].currentStatus == "IN DYEING") {
                    newRow.style.background = "LightPink";
                } else if (tableValues[i].currentStatus == "Grey" || tableValues[i].currentStatus == "GREY") {
                    newRow.style.background = "Grey";
                } else newRow.style.background = "Orange";

                newCell = document.createElement("td");
                newCell.textContent = tableValues[i].currentStatus;
                newRow.appendChild(newCell);

                newCell = document.createElement("td");
                var btn = document.createElement('input');
                btn.type = "button";
                btn.id = "changeStatusButton" + tableValues[i].stockAdditionSeries;
                btn.value = "Change Status";
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
