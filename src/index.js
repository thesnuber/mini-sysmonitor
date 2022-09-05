const { app, BrowserWindow } = require('electron');
const os = require('os-utils');
const path = require('path');
const si = require('systeminformation');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
	minWidth: 400,
	minHeight: 650,
	maxWidth: 400,
    maxHeight: 650,
    width: 400,
    height: 650,
	//titleBarStyle: 'hidden',
	//titleBarOverlay: true,
	icon: __dirname + '/favicon.ico',
    webPreferences: {
		preload: path.join(__dirname, 'preload.js'),
		nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
    },
  });
  
  

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
 // mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  
  mainWindow.webContents.on('new-window', function(e, url) {
  e.preventDefault();
  require('electron').shell.openExternal(url);
});

  setInterval(() => {
  os.cpuUsage(function(v){
	  
	  // Uso CPU
	  mainWindow.webContents.send('use',v*100);
	  //Quantidade total memória
	  mainWindow.webContents.send('totalmem',os.totalmem());
	  //Quantidade memória livre
	  mainWindow.webContents.send('freemem',os.freemem());
	  //Tempo do PC ligado
	  mainWindow.webContents.send('upsys',os.sysUptime()/60);
	  
	  
  });
  },1000);


 // setInterval(() => {
  
      // Plataforma  
	  // OS 
	  si.osInfo().then(data => mainWindow.webContents.send('version',data));
	  // Modelo CPU, Quantidade núcleos
	  si.cpu().then(data => mainWindow.webContents.send('cpu',data));
	  //GPU
	  si.graphics().then(data => mainWindow.webContents.send('gpu',data));
	  //Disk
	  si.diskLayout().then(data => mainWindow.webContents.send('disk',data));
	  //board
	  si.baseboard().then(data => mainWindow.webContents.send('board',data));
	  
	  
   //   },10000);
	  
  		  
	  
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
