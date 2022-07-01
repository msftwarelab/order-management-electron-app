var dbValues = null;
var mysql = require('mysql');
var express=require('express');
var app=express();

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'darshanjain@123',
    database: 'ordermanagement',
    insecureAuth: true
});
connection.connect();

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

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'