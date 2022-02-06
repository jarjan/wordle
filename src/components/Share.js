import { useCallback, useContext } from "preact/hooks";

import { GameContext } from "../game/provider";

const convertTip = (row) => {
  return Array.from({ length: 6 })
    .map((_, i) => {
      if (row[i] && row[i].isExact) {
        return "🟩";
      } else if (row[i] && row[i].isCorrect) {
        return "🟨";
      } else {
        return "⬜️";
      }
    })
    .join("");
};

export const Share = () => {
  const { gameover, tips } = useContext(GameContext);
  const result = tips.map(convertTip).join("\n");

  const handleClick = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        text: `Қазақша Wordle!\n${result}\nhttps://wordle.jarjan.xyz`,
      });
    }
  }, [tips]);

  if (!gameover || !navigator.share) return null;

  return (
    <div class="share">
      <button type="button" onClick={handleClick}>
        Нәтижемен бөліс!
      </button>
    </div>
  );
};
