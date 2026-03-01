const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    const argvUrl = (() => {
      const arg = process.argv.find(a => a.startsWith('--dev-url='));
      return arg ? arg.split('=')[1] : null;
    })();
    const devUrl = argvUrl || process.env.DEV_SERVER_URL || 'http://localhost:5173';
    win.loadURL(devUrl);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '..', 'web-app', 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
