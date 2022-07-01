const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let loginPageWindow;
let homePageWindow;
let addNewItemToStock;
let availableStock;
let dispatchHistory;
let dispatchPendingOrders;
let newOrderForm;
let newStockStatus;
let openingStockEntry;
let orderHistory;
let developerContact;
let shortcut;

global.productionStatsID = {
    prodOne: "Darshan",
    orderDispatchKey: "Jain"
};

app.on('ready', function () {
    homePageWindow = new BrowserWindow({
        minimizable: true,
        maximizable: true,
        closable: true,
    });
    homePageWindow.maximize();
    homePageWindow.setMenu(null);

    /*
    loginPageWindow = new BrowserWindow({
        width: 350,//650
        height: 250,//550
        minimizable: false,
        parent: homePageWindow,
        maximizable: false,
        closable: true,
        frame: false,
        resizable: false
    });
    loginPageWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/loginPage.html'),
        protocol: 'file:',
        slashes: true,
    }));
    loginPageWindow.setMenu(null);
    //loginPageWindow.webContents.openDevTools();
    */
    // delete line below
    createHomePageWindow();

    homePageWindow.on('closed', function () {
        loginPageWindow = null;
        app.quit();
    });
});

ipcMain.on('SUCCESSFUL', function (e) {
    createHomePageWindow();
    loginPageWindow.close();
    loginPageWindow = null;

});

function createHomePageWindow() {
    homePageWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/homePage.html'),
        protocol: 'file:',
        slashes: true
    }));
    const homePageMenu = Menu.buildFromTemplate(homePageMenuTemplate);
    Menu.setApplicationMenu(homePageMenu);
    //homePageWindow.webContents.openDevTools();
}

//menu template
const homePageMenuTemplate = [{
    label: 'Product Entry',
    accelerator: process.platform == 'darwin' ? 'Command + Q' : 'Ctrl + Q',
    click() {
        openOpeningStockEntryPage();
    }
},
{
    label: 'Orders',
    submenu: [{
        label: 'New Order Form',
        accelerator: process.platform == 'darwin' ? 'Command + W' : 'Ctrl + W',
        click() {
            openNewOrderForm();
        }
    },
    {
        label: 'Order history',
        click() {
            openOrderHistoryPage();
        }
    }],
},
{
    label: 'Stock',
    submenu: [{
        label: 'Available stock',
        accelerator: process.platform == 'darwin' ? 'Command + S' : 'Ctrl + S',
        click() {
            openAvailableStockPage();
        }
    },
    {
        label: 'Add New Item To Stock',
        accelerator: process.platform == 'darwin' ? 'Command + A' : 'Ctrl + A',
        click() {
            openAddNewItemToStockPage();
        }
    },
    {
        label: 'New Stock status',
        click() {
            openNewStockStatusPage();
        }
    }],
},
{
    label: 'Dispatch pending',
    accelerator: process.platform == 'darwin' ? 'Command + D' : 'Ctrl + D',
    submenu: [{
        label: 'Dispatch Pending List',
        click() {
            openDispatchPendingOrderPage();
        }
    },
    {
        label: 'Dispatched History',
        click() {
            openDispatchHistoryPage();
        }
    }],
},
{
    label: 'Help',
    submenu: [{
        label: 'Contact developer',
        click() {
            openDeveloperContactPage();
        }
    },
    {
        label: 'Close app',
        click() {
            app.quit();
        }
    },
    {
        label: 'Shortcuts',
        click() {
            openShortcutsPage();
        }
    },
    {
        label: 'Developer tool',
        click() {
            homePageWindow.webContents.openDevTools();
        }
    }],
}];


function openOpeningStockEntryPage() {
    openingStockEntry = new BrowserWindow({
        width: 1200,
        height: 625,
        minimizable: false,
        parent: homePageWindow,
        maximizable: false,
        closable: true,
        frame: false,
        resizable: false,
    });
    openingStockEntry.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/openingStockEntryPage.html'),
        protocol: 'file:',
        slashes: true
    }));
    openingStockEntry.setMenu(null);
    openingStockEntry.webContents.openDevTools();
}

function openNewOrderForm() {
    newOrderForm = new BrowserWindow({
        width: 1200,
        height: 625,
        minimizable: false,
        maximizable: false,
        parent: homePageWindow,
        closable: true,
        frame: false,
        resizable: false,
    });
    newOrderForm.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/newOrderForm.html'),
        protocol: 'file:',
        slashes: true
    }));
    newOrderForm.setMenu(null);
    newOrderForm.webContents.openDevTools();
}

function openOrderHistoryPage() {
    orderHistory = new BrowserWindow({
        width: 1200,
        height: 625,
        minimizable: false,
        maximizable: false,
        parent: homePageWindow,
        closable: true,
        frame: false,
        resizable: false,
    });
    orderHistory.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/orderHistoryPage.html'),
        protocol: 'file:',
        slashes: true
    }));
    orderHistory.setMenu(null);
    orderHistory.webContents.openDevTools();
}

function openAvailableStockPage() {
    availableStock = new BrowserWindow({
        width: 1200,
        height: 625,
        minimizable: false,
        maximizable: false,
        parent: homePageWindow,
        closable: true,
        frame: false,
        resizable: false,
    });
    availableStock.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/availableStockPage.html'),
        protocol: 'file:',
        slashes: true
    }));
    availableStock.setMenu(null);
    availableStock.webContents.openDevTools();
}

function openAddNewItemToStockPage() {
    addNewItemToStock = new BrowserWindow({
        width: 1200,
        height: 625,
        minimizable: false,
        parent: homePageWindow,
        maximizable: false,
        closable: true,
        frame: false,
        resizable: false,
    });
    addNewItemToStock.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/addNewItemToStockPage.html'),
        protocol: 'file:',
        slashes: true
    }));
    addNewItemToStock.setMenu(null);
    addNewItemToStock.webContents.openDevTools();
}

function openNewStockStatusPage() {
    newStockStatus = new BrowserWindow({
        width: 1200,
        height: 625,
        minimizable: false,
        maximizable: false,
        parent: homePageWindow,
        closable: true,
        frame: false,
        resizable: false,
    });
    newStockStatus.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/newStockStatusPage.html'),
        protocol: 'file:',
        slashes: true
    }));
    newStockStatus.setMenu(null);
    newStockStatus.webContents.openDevTools();
}

function openDispatchPendingOrderPage() {
    dispatchPendingOrders = new BrowserWindow({
        width: 1200,
        height: 625,
        minimizable: false,
        maximizable: false,
        parent: homePageWindow,
        closable: true,
        frame: false,
        resizable: false,
    });
    dispatchPendingOrders.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/dispatchPendingOrdersPage.html'),
        protocol: 'file:',
        slashes: true
    }));
    dispatchPendingOrders.setMenu(null);
    dispatchPendingOrders.webContents.openDevTools();
}

function openDispatchHistoryPage() {
    dispatchHistory = new BrowserWindow({
        width: 1200,
        height: 625,
        minimizable: false,
        maximizable: false,
        parent: homePageWindow,
        closable: true,
        frame: false,
        resizable: false,
    });
    dispatchHistory.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/dispatchHistoryPage.html'),
        protocol: 'file:',
        slashes: true
    }));
    dispatchHistory.setMenu(null);
    dispatchHistory.webContents.openDevTools();
}

function openDeveloperContactPage() {
    developerContact = new BrowserWindow({
        width: 1200,
        height: 625,
        minimizable: false,
        maximizable: false,
        parent: homePageWindow,
        closable: true,
        frame: false,
        resizable: false,
    });
    developerContact.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/developerContactPage.html'),
        protocol: 'file:',
        slashes: true
    }));
    developerContact.setMenu(null);
    //developerContact.webContents.openDevTools();
}

function openShortcutsPage() {
    shortcut = new BrowserWindow({
        width: 1150,
        height: 575,
        minimizable: false,
        parent: homePageWindow,
        maximizable: false,
        closable: true,
        frame: false,
        resizable: false,
    });
    shortcut.loadURL(url.format({
        pathname: path.join(__dirname, '../webFiles/shortcuts.html'),
        protocol: 'file:',
        slashes: true
    }));
    shortcut.setMenu(null);
}