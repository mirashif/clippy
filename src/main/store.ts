import Store from 'electron-store';

export type Text = {
  id: string;
  text: string;
};

export type StoreSchema = {
  texts: Text[];
};

export const STORE_KEYS: { [key: string]: keyof StoreSchema } = {
  TEXTS: 'texts',
};

const store = new Store<StoreSchema>({
  defaults: {
    texts: [],
  },
});
export default store;
