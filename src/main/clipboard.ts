import { ipcMain } from 'electron';
import clipboard from '@nandorojo/electron-clipboard';

import store, { STORE_KEYS, Text } from './store';

const updateClipboard = () => {
  const prev: Text[] = store.get(STORE_KEYS.TEXTS);
  const text: string = clipboard.readText();
  const found = prev.find((p) => p.text === text);

  // if found, remove it from prev
  // and add it to the end of the store
  if (found) {
    const index = prev.indexOf(found);
    prev.splice(index, 1);
    store.set(STORE_KEYS.TEXTS, [...prev, found]);
  } else {
    const current = { id: crypto.randomUUID(), text };
    store.set(STORE_KEYS.TEXTS, [...prev, current]);
  }
};

export default function clipboardService() {
  clipboard.on('text-changed', updateClipboard).startWatching();

  ipcMain.handle('store:get-texts', async () => {
    return store.get(STORE_KEYS.TEXTS);
  });

  ipcMain.handle('store:copy-text', async (_event, text) => {
    clipboard.writeText(text);
  });
}
