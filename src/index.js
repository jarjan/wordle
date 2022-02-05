import "./style";

import { GameProvider } from "./game/provider";

import { Toast } from "./components/Toast";
import { Board } from "./components/Board";
import { Keyboard } from "./components/Keyboard";
import { Header } from "./components/Header";

export default function App() {
  return (
    <GameProvider>
      <div class="wordle">
        <Toast />
        <Header />
        <Board />
        <Keyboard />
      </div>
    </GameProvider>
  );
}
