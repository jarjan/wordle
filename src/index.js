import "./style";

import Game from "./components/Game";
import Toast from "./components/Toast";

export default function App() {
  return (
    <div class="wordle">
      <Toast>
        <Game />
      </Toast>
    </div>
  );
}
