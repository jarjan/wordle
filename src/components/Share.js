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
        title: "Қазақша Wordle!",
        text: `Қазақша Wordle!\n${result}`,
        url: "https://wordle.jarjan.xyz",
      });
    }
  }, []);

  if (!gameover) return null;

  return (
    <div class="share">
      <button type="button" onClick={handleClick}>
        Нәтижемен бөліс!
      </button>
    </div>
  );
};
