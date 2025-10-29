const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (data) => ipcRenderer.invoke('dialog:saveFile', data),
  restoreFromFile: () => ipcRenderer.invoke('dialog:openFile'),
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  launchDiscord: (url) => ipcRenderer.invoke('launch-discord', url),
});