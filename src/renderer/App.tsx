import './App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { Text } from 'main/store';

export const textsAtom = atom<Text[]>([]);

const Home = () => {
  const [texts, setTexts] = useAtom(textsAtom);

  useEffect(() => {
    const refreshClipboard = async () => {
      const data = await window.electron.getTexts();
      setTexts(data);
    };

    const interval = setInterval(() => {
      refreshClipboard();
    }, 500);

    refreshClipboard();

    return () => clearInterval(interval);
  }, [setTexts]);

  return (
    <div className="flex flex-col">
      <header className="navbar sticky top-0 z-10 flex justify-between bg-base-200 p-4">
        <h1 className="flex-1 text-2xl">Clippy</h1>
        {texts.length > 0 && (
          <button
            onClick={() => window.electron.deleteTexts()}
            type="button"
            className="btn btn-xs flex-none"
          >
            Clear all
          </button>
        )}
      </header>

      {!texts.length ? (
        <h2 className="my-6 text-center text-base italic">
          Copy texts and they will appear here!
        </h2>
      ) : (
        <ul className="flex flex-col gap-3 px-4 py-2">
          {texts.reverse().map(({ id, text }) => (
            <button
              onClick={() => {
                window.electron.addText(text);
              }}
              type="button"
              key={id}
              className="card card-compact basis-full border-base-100 bg-base-100 shadow-sm transition hover:border-base-content hover:shadow-md"
            >
              <div className="flex w-full justify-between p-4">
                <p className="text-start text-base leading-relaxed line-clamp-3">
                  {text}
                </p>
              </div>
            </button>
          ))}
        </ul>
      )}
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
