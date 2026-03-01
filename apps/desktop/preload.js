const { contextBridge } = require('electron');

// Expose a minimal safe bridge if needed by the renderer
contextBridge.exposeInMainWorld('electronAPI', {});
