import 'tailwindcss/tailwind.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';

export const clipboardAtom = atom<string[]>([]);

const Home = () => {
  const [clipboardHistory, setClipboardHistory] = useAtom(clipboardAtom);

  useEffect(() => {
    const fetchClipboard = () => {
      const data = window.electron.store.get('clipboardHistory');
      setClipboardHistory(data);
    };

    const interval = setInterval(() => {
      fetchClipboard();
    }, 500);

    fetchClipboard();

    return () => clearInterval(interval);
  }, [setClipboardHistory]);

  if (!clipboardHistory) {
    return (
      <div className="grid place-items-center">
        Copy texts and they will appear here!
      </div>
    );
  }

  return (
    <div className="m-4 flex flex-col gap-2">
      {clipboardHistory.map((v: string) => (
        <div key={JSON.stringify(v)} className="rounded-lg bg-white">
          {v}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
