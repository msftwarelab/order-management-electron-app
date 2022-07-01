var invoiceNo = "";

function add_row(argument) {
    var partyName = document.getElementById("partyName").value.trim();
    invoiceNo = document.getElementById("invoiceNo").value.trim();
    var design_name = document.getElementById("design_name").value.trim();

    var design_no_index = document.getElementById("design_no").selectedIndex;
    var tempD = document.getElementById("design_no");
    var design_no = tempD.options[tempD.selectedIndex].text.trim();

    var shade_no_index = document.getElementById("shade_no").selectedIndex;
    var tempS = document.getElementById("shade_no");
    var shade_no = tempD.options[tempS.selectedIndex].text.trim();

    var qty = document.getElementById("qty").value.trim();
    var totalMeters = document.getElementById("totalMeters").innerHTML;
    var table = document.getElementById("data_table");

    var orderDate = document.getElementById("orderDate").value;
    var tempDateArray = orderDate.split("-");
    orderDate = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];

    if (initialCheck(partyName, invoiceNo, design_name, design_no_index, shade_no_index, qty) == 0)
        return;
    if (checkTableContentForEmpty(table) == 0)
        return;

    var myTable = document.getElementById("data_table");
    var currentIndex = myTable.rows.length;
    var currentRow = myTable.insertRow(currentIndex - 1);

    var designNameBox = document.createElement("input");
    designNameBox.setAttribute("name", "design_name" + currentIndex);
    designNameBox.setAttribute("onchange", "return checkTabEnterPress(this, event)");

    var designNoDropdown = document.createElement("select");
    designNoDropdown.setAttribute("id", "design_no" + currentIndex);
    designNoDropdown.setAttribute("value", "Design No");
    designNoDropdown.setAttribute("class", "browser-default");
    designNoDropdown.setAttribute("onchange", "loadShadeNo(this.id, this.value)");

    var designNoOptions = document.createElement("option");
    designNoOptions.setAttribute("value", "Design_No_option" + currentIndex);
    designNoOptions.innerHTML = "Design No";
    designNoDropdown.appendChild(designNoOptions);

    var shadeNoDropdown = document.createElement("select");
    shadeNoDropdown.setAttribute("id", "shade_no" + currentIndex);
    shadeNoDropdown.setAttribute("value", "Shade No");
    shadeNoDropdown.setAttribute("class", "browser-default");
    shadeNoDropdown.setAttribute("onchange", "loadAvailableQuantity(this.id,this.value)");

    var shadeNoOptions = document.createElement("option");
    shadeNoOptions.setAttribute("value", "Shade_No_option" + currentIndex);
    shadeNoOptions.innerHTML = "Shade No";
    shadeNoDropdown.appendChild(shadeNoOptions);

    var qtyBox = document.createElement("input");
    qtyBox.setAttribute("type", "number");
    qtyBox.setAttribute("name", "qty" + currentIndex);
    qtyBox.setAttribute("onchange", "findTotalMeters()");

    var availableStockBox = document.createElement("label");
    availableStockBox.setAttribute("id", "availableInStock" + currentIndex);
    availableStockBox.innerHTML = "NIL";
    availableStockBox.setAttribute("style", "font-size: 15px; color: black;");

    var lockedQtyBox = document.createElement("label");
    lockedQtyBox.setAttribute("id", "lockedQty" + currentIndex);
    lockedQtyBox.innerHTML = "NIL";
    lockedQtyBox.setAttribute("style", "font-size: 15px;");

    var addRowBox = document.createElement("input");
    addRowBox.setAttribute("type", "button");
    addRowBox.setAttribute("value", "Add Row");
    addRowBox.setAttribute("onclick", "add_row();");
    addRowBox.setAttribute("class", "button");

    var addDeleteBox = document.createElement("input");
    addDeleteBox.setAttribute("type", "button");
    addDeleteBox.setAttribute("value", "Delete");
    addDeleteBox.setAttribute("onclick", "delete_row(this);");
    addDeleteBox.setAttribute("class", "button");

    var currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(designNameBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(designNoDropdown);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(shadeNoDropdown);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(qtyBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(availableStockBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(lockedQtyBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(addRowBox);

    currentCell.appendChild(addDeleteBox);
}

function delete_row(rows) {
    var _row = rows.parentElement.parentElement;
    document.getElementById('data_table').deleteRow(_row.rowIndex);
    findTotalMeters();
}

function loadValuesInDesignNo(cuContext, results) {
    var tempDesignName = cuContext.split("design_name");
    designNoLongArray = [];
    uniqueDesignNoArray = [];
    var sel = document.getElementById("design_no" + tempDesignName[1]);
    sel.innerHTML = "";

    for (var i = 0; i < results.length; i++) {
        designNoLongArray.push(results[i].designNo);
    }

    for (var j = 0; j < designNoLongArray.length; j++) {
        if (!uniqueDesignNoArray.includes(designNoLongArray[j])) {
            uniqueDesignNoArray.push(designNoLongArray[j]);
        }
    }

    // add first option with disabled class
    var opt = document.createElement('option');
    opt.innerHTML = "Design No";
    sel.appendChild(opt);
    for (k = 0; k < uniqueDesignNoArray.length; k++) {
        var opt = document.createElement('option');
        opt.innerHTML = uniqueDesignNoArray[k];
        opt.value = uniqueDesignNoArray[k];
        sel.appendChild(opt);
    }
}

function loadShadeNo(cuContext, val) {
    selectedDesingNo = val;
    var tempShadeNo = "";
    uniqueShadeNoArray = [];
    var tempDesignNo = cuContext.split("design_no");
    var selShade = document.getElementById("shade_no" + tempDesignNo[1]);
    selShade.innerHTML = "";

    var opt = document.createElement('option');
    opt.innerHTML = "Shade No";
    selShade.appendChild(opt);

    connection.query("SELECT shadeNo from openingstock WHERE designName like '%" + selectedDesignName + "%' AND designNo = '" + selectedDesingNo + "' ORDER BY shadeNo ASC;", function (error, results, fields) {
        if (error) throw error;
        tempShadeNo = results;
        for (var i = 0; i < tempShadeNo.length; i++) {
            uniqueShadeNoArray.push(tempShadeNo[i].shadeNo);
            var opt = document.createElement('option');
            opt.innerHTML = uniqueShadeNoArray[i];
            opt.value = uniqueShadeNoArray[i];
            selShade.appendChild(opt);
        }
    });
}

function loadAvailableQuantity(cuContext, val) {
    selectedShadeNo = val;
    var tempAvailableQuantity = "";
    var tempDesignNo = cuContext.split("shade_no");
    var selAvailableStock = document.getElementById("availableInStock" + tempDesignNo[1]);
    selAvailableStock.innerHTML = "NIL";
    var selLockedQty = document.getElementById("lockedQty" + tempDesignNo[1]);
    selLockedQty.innerHTML = "NIL";

    connection.query("SELECT qty, inGrey, inDyeing, lockingValue from openingstock WHERE designName ='" + selectedDesignName + "' AND designNo = '" + selectedDesingNo + "' AND shadeNo = '" + selectedShadeNo + "' ORDER BY shadeNo ASC;", function (error, results, fields) {
        if (error) throw error;
        tempAvailableQuantity = results;
        selAvailableStock.innerHTML = results[0].qty + " / " + results[0].inGrey + " / " + results[0].inDyeing;
        selLockedQty.innerHTML = results[0].lockingValue;
    });
}

function findTotalMeters() {
    var table = document.getElementById("data_table");
    var totalM = 0;
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        if (table.rows[r].cells[3].getElementsByTagName("input")[0].value != '') {
            totalM = parseFloat(totalM) + parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value);
        }
    }
    document.getElementById("totalMeters").innerHTML = totalM.toString();
}

function initialCheck(partyName, invoiceNo, design_name, design_no_index, shade_no_index, qty) {
    if (partyName == null || partyName == '') {
        document.getElementById('partyName').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('partyName').style.borderColor = "grey";

    if (invoiceNo == null || invoiceNo == '') {
        document.getElementById('invoiceNo').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('invoiceNo').style.borderColor = "grey"

    if (design_name == null || design_name == '') {
        document.getElementById('design_name').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('design_name').style.borderColor = "grey"

    if (design_no_index == "0") {
        document.getElementById('design_no').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('design_no').style.borderColor = "grey";

    if (shade_no_index == "0") {
        document.getElementById('shade_no').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('shade_no').style.borderColor = "grey";

    if (qty == null || qty == '') {
        document.getElementById('qty').style.borderColor = "red";
        return 0;
    }
    else document.getElementById('qty').style.borderColor = "grey"

    return 1;
}

function checkTableContentForEmpty(table) {
    for (var r = 2, n = table.rows.length - 1; r < n; r++) {
        //design name
        if (table.rows[r].cells[0].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[0].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[0].getElementsByTagName("input")[0].style.borderColor = "red";
            return 0;
        }
        else table.rows[r].cells[0].getElementsByTagName("input")[0].style.borderColor = "grey";

        //design no dropdown
        if (table.rows[r].cells[1].getElementsByTagName("select")[0].selectedIndex == "0") {
            table.rows[r].cells[1].getElementsByTagName("select")[0].style.borderColor = "red";
            return 0;
        }
        else table.rows[r].cells[1].getElementsByTagName("select")[0].style.borderColor = "grey";

        //shade no dropdown
        if (table.rows[r].cells[2].getElementsByTagName("select")[0].selectedIndex == "0") {
            table.rows[r].cells[2].getElementsByTagName("select")[0].style.borderColor = "red";
            return 0;
        }
        else table.rows[r].cells[2].getElementsByTagName("select")[0].style.borderColor = "grey";

        //qty
        if (table.rows[r].cells[3].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[3].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[3].getElementsByTagName("input")[0].style.borderColor = "red";
            return 0;
        }
        else table.rows[r].cells[3].getElementsByTagName("input")[0].style.borderColor = "grey";
    }
    return 1;
}

function submitForm() {
    var partyName = document.getElementById("partyName").value.trim();
    invoiceNo = document.getElementById("invoiceNo").value.trim();
    var design_name = document.getElementById("design_name").value.trim();

    var design_no_index = document.getElementById("design_no").selectedIndex;
    var tempD = document.getElementById("design_no");
    var design_no = tempD.options[tempD.selectedIndex].text.trim();

    var shade_no_index = document.getElementById("shade_no").selectedIndex;
    var tempS = document.getElementById("shade_no");
    var shade_no = tempD.options[tempS.selectedIndex].text.trim();

    var qty = document.getElementById("qty").value.trim();
    var totalMeters = document.getElementById("totalMeters").innerHTML;
    var table = document.getElementById("data_table");

    var orderDate = document.getElementById("orderDate").value;
    var tempDateArray = orderDate.split("-");
    orderDate = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];

    if (initialCheck(partyName, invoiceNo, design_name, design_no_index, shade_no_index, qty) == 0)
        return;
    if (checkTableContentForEmpty(table) == 0)
        return;

    //Save first entry
    connection.query("Insert into neworder VALUES ('" + invoiceNo.toUpperCase() + "','" + partyName.toUpperCase() + "','" + orderDate.toUpperCase() + "','" + design_name.toUpperCase() + "','" + design_no.toUpperCase() + "','" + shade_no.toUpperCase() + "','" + qty.toUpperCase() + "','" + totalMeters.toUpperCase() + "')",
        function (err, result) {
            if (err) throw err;
        });

    //Save first row in dispatchPending Table
    //Save first entry
    connection.query("Insert into dispatchpending VALUES ('" + invoiceNo.toUpperCase() + "','" + partyName.toUpperCase() + "','" + orderDate.toUpperCase() + "','" + design_name.toUpperCase() + "','" + design_no.toUpperCase() + "','" + shade_no.toUpperCase() + "','" + qty.toUpperCase() + "','" + totalMeters.toUpperCase() + "','" + "NO" + "')",
        function (err, result) {
            if (err) throw err;
        });

    // save rest of the entries from the table
    for (var r = 2, n = table.rows.length - 1; r < n; r++) {
        var tableDesignName = table.rows[r].cells[0].getElementsByTagName("input")[0].value.trim();
        var tempF = table.rows[r].cells[1].getElementsByTagName("select")[0];
        var tableDesignNo = tempF.options[tempF.selectedIndex].text.trim();
        var tempG = table.rows[r].cells[2].getElementsByTagName("select")[0];
        var tableShadeNo = tempG.options[tempG.selectedIndex].text.trim();
        var tableQty = table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim();

        connection.query("Insert into neworder VALUES ('" + invoiceNo.toUpperCase() + "','" + partyName.toUpperCase() + "','" + orderDate.toUpperCase() + "','" + tableDesignName.toUpperCase() + "','" + tableDesignNo.toUpperCase() + "','" + tableShadeNo.toUpperCase() + "','" + tableQty.toUpperCase() + "','" + totalMeters.toUpperCase() + "')",
            function (err, result) {
                if (err) throw err;
            });

        connection.query("Insert into dispatchpending VALUES ('" + invoiceNo.toUpperCase() + "','" + partyName.toUpperCase() + "','" + orderDate.toUpperCase() + "','" + tableDesignName.toUpperCase() + "','" + tableDesignNo.toUpperCase() + "','" + tableShadeNo.toUpperCase() + "','" + tableQty.toUpperCase() + "','" + totalMeters.toUpperCase() + "','" + "NO" + "')",
            function (err, result) {
                if (err) throw err;
            });
    }

    // reduce stock against order
    reduceStockAgainstOrder(table);
    resetInvoiceNo();
}

function reduceStockAgainstOrder(table) {
    var r = 1;
    var orderDetails = [];
    var stockTableValues = [];
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tableDesignName = table.rows[r].cells[0].getElementsByTagName("input")[0].value.trim();
        var tempF = table.rows[r].cells[1].getElementsByTagName("select")[0];
        var tableDesignNo = tempF.options[tempF.selectedIndex].text.trim();
        var tempG = table.rows[r].cells[2].getElementsByTagName("select")[0];
        var tableShadeNo = tempG.options[tempG.selectedIndex].text.trim();
        var tableQty = table.rows[r].cells[3].getElementsByTagName("input")[0].value.trim();
        tableDesignName = tableDesignName.toUpperCase();
        tableDesignNo = tableDesignNo.toUpperCase();
        tableShadeNo = tableShadeNo.toUpperCase();
        tableQty = parseFloat(tableQty);
        connection.query("UPDATE openingstock as t1, ( SELECT lockingValue from openingstock where designName = '" + tableDesignName + "' AND designNo = '" + tableDesignNo + "' AND shadeNo = '" + tableShadeNo + "') as t2 set t1.lockingValue = t2.lockingValue + " + tableQty + "  where t1.designName = '" + tableDesignName + "' AND t1.designNo = '" + tableDesignNo + "' AND t1.shadeNo = '" + tableShadeNo + "';", function (error, results, fields) {
            if (error) throw error;
        });
    }
}

//update series number of order form
function resetInvoiceNo() {
    //alert("Done!");
    var currentInvoiceNo = parseInt(document.getElementById("invoiceNo").value);
    currentInvoiceNo = currentInvoiceNo + 1;
    connection.query("UPDATE seriesnumber SET seriesValue ='" + currentInvoiceNo + "' WHERE seriesName = 'orderBook' ", function (error, results, fields) {
        if (error) throw error;
    });
    ///window.location.reload();
}

function searchBox() {
    var d = document.getElementById("design_name");
    app.set('../webFiles', __dirname + '../webFiles');
    app.use(express.static(__dirname + '../javaScriptFiles'));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    app.get('/', function (req, res) {
        res.render('newOrderForm.html');
    });

    app.get('/search', function (req, res) {
        connection.query('SELECT designName from openingstock where designName like "%' + d.value.toUpperCase() + '%"', function (err, rows, fields) {
            if (err) throw err;
            var data = [];
            for (i = 0; i < rows.length; i++) {
                data.push(rows[i].d);
            }
            res.end(JSON.stringify(data));
        });
    });

    var server = app.listen(3000, function () {
        console.log("We have started our server on port 3000");
    });

}