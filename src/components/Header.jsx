import { useContext } from "preact/hooks";

import { GameContext } from "../game/provider";

export const Header = () => {
  const { gameover, untilNextWord } = useContext(GameContext);

  return (
    <div class="header">
      <h1>Қазақша Wordle!</h1>
      {gameover && <small>Келесі сөзге дейін {untilNextWord}</small>}
      <hr />
    </div>
  );
};
