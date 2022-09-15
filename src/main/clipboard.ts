import { clipboard, ipcMain } from 'electron';
import clip from '@nandorojo/electron-clipboard';
import crypto from 'crypto';

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
  clip.on('text-changed', updateClipboard).startWatching();

  ipcMain.on('store:add-text', async (_event, text) => {
    clipboard.writeText(text);
  });

  ipcMain.handle('store:get-texts', async () => {
    return store.get(STORE_KEYS.TEXTS);
  });

  ipcMain.on('store:delete-text', async (_event, id) => {
    const prev: Text[] = store.get(STORE_KEYS.TEXTS);
    const result = prev.filter((p) => p.id !== id);
    store.set(STORE_KEYS.TEXTS, result);
  });

  ipcMain.handle('store:delete-texts', async () => {
    store.reset(STORE_KEYS.TEXTS);
  });
}
