const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  // IPC handler to securely provide the API key to the renderer process
  ipcMain.handle('get-api-key', () => {
    return process.env.API_KEY;
  });

  // IPC handler for saving a file
  ipcMain.handle('dialog:saveFile', async (event, data) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Save App Data',
        defaultPath: `scheduler-backup-${new Date().toISOString().split('T')[0]}.json`,
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });
    if (!canceled && filePath) {
      fs.writeFileSync(filePath, data, 'utf-8');
    }
  });

  // IPC handler for restoring from a file
  ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: 'Restore App Data',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile']
    });
    if (!canceled && filePaths.length > 0) {
      return fs.readFileSync(filePaths[0], 'utf-8');
    }
    return null;
  });

  // IPC handler for launching Discord in a new window
  ipcMain.handle('launch-discord', (event, url) => {
    const parentWindow = BrowserWindow.getFocusedWindow();
    if (!parentWindow || !url || !url.startsWith('https://discord.com')) return;

    const discordWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      parent: parentWindow,
      modal: true, // Makes the window a modal dialog
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
      }
    });
    discordWindow.loadURL(url);
    discordWindow.setMenuBarVisibility(false); // For a cleaner UI
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});