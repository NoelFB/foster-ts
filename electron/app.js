"use strict"

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

app.on('window-all-closed', () =>
{
	if (process.platform != 'darwin')
		app.quit();
});

app.on('ready', () =>
{
	let win = new BrowserWindow();
	win.setMenu(null);
	win.loadURL(`file://${__dirname}/index.html`);

	// comment this line out to not open devtools by default
	win.webContents.openDevTools();

	win.on("closed", () =>
	{ 
		win = null; 
	});
});
