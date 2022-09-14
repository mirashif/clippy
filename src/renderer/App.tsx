import './App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { clipboard } from 'electron';

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
    <div className="flex flex-col bg-base-200">
      <header className="navbar sticky top-0 z-10 flex justify-between bg-base-200 p-4">
        <h1 className="flex-1 text-2xl">Clippy</h1>
        <button className="btn btn-xs flex-none" type="button">
          Clear all
        </button>
      </header>
      <ul className="flex flex-col gap-3 px-4 py-2">
        {clipboardHistory.reverse().map((value: string) => (
          <button
            onClick={() => {
              window.electron.store.set('clipboard-history', value);
            }}
            type="button"
            key={JSON.stringify(value)}
            className="card card-compact basis-full border-base-100 bg-base-100 shadow-sm transition hover:border-base-content hover:shadow-md"
          >
            <div className="flex w-full justify-between p-4">
              <p className="text-start text-base leading-relaxed line-clamp-3">
                {value}
              </p>

              <button
                type="button"
                className="btn btn-ghost btn-square btn-xs shrink"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
            </div>
          </button>
        ))}
      </ul>
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
