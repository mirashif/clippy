import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getTexts: async () => ipcRenderer.invoke('store:get-texts'),
  addText: (text: string) => ipcRenderer.send('store:add-text', text),
  deleteTexts: () => ipcRenderer.invoke('store:delete-texts'),
} as Window['electron']);
