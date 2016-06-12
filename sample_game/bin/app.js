"use strict"

const electron = require("electron");
const BrowserWindow = require('browser-window');

var app = require('app');

app.on('window-all-closed', function() 
{
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', function()
{
        var screen = new BrowserWindow();
        screen.setMenu(null);
        screen.toggleDevTools();
        screen.loadUrl('file:///' + __dirname + '/index.html');
        screen.on("closed", function() 
        { 
            screen = null; 
        });
});
