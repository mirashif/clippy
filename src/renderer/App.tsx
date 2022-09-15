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
              className="card card-compact basis-full border-base-100 bg-base-100 shadow-sm transition hover:border-primary-focus hover:shadow-md"
            >
              <div className="flex w-full justify-between gap-2 p-4">
                <p className="text-start text-base leading-relaxed line-clamp-3">
                  {text}
                </p>
                <span
                  role="button"
                  tabIndex={0}
                  aria-roledescription="delete text"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.electron.deleteText(id);
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      window.electron.deleteText(id);
                    }
                  }}
                  className="btn btn-outline btn-square btn-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
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
