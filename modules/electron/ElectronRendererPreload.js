const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    test: 'test',
    setTitle: (title) => ipcRenderer.send('set-title', title),
});
