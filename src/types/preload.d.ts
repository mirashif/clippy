import { Text } from 'main/store';

declare global {
  interface Window {
    electron: {
      addText: (text: string) => void;
      getTexts: () => Promise<Text[]>;
      deleteTexts: () => void;
    };
  }
}

export {};
