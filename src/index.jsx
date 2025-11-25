import "./style.css";

import { GameProvider } from "./game/provider";

import { Toast } from "./components/Toast";
import { Board } from "./components/Board";
import { Keyboard } from "./components/Keyboard";
import { Header } from "./components/Header";
import { Share } from "./components/Share";

import { render } from 'preact';

export default function App() {
  return (
    <GameProvider>
      <Toast />
      <Header />
      <Board />
      <Keyboard />
      <Share />
    </GameProvider>
  );
}

if (typeof window !== 'undefined') {
  render(<App />, document.getElementById('app'));
}

export async function prerender(data) {
  const { default: renderToString } = await import("preact-render-to-string");
  return {
    html: renderToString(<App />),
    links: new Set(),
  };
}
