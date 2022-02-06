import "./style";

import { GameProvider } from "./game/provider";

import { Toast } from "./components/Toast";
import { Board } from "./components/Board";
import { Keyboard } from "./components/Keyboard";
import { Header } from "./components/Header";
import { Share } from "./components/Share";

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
