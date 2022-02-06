import { useCallback, useContext } from "preact/hooks";

import { GameContext } from "../game/provider";

const convertTip = (row) => {
  return Array.from({ length: 5 })
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
  const table = tips.map(convertTip);
  const result = table
    .slice(0, table.findIndex((row) => row === "🟩🟩🟩🟩🟩") + 1)
    .join("\n");
  const text = `Қазақша Wordle!\n\n${result}\n\nhttps://wordle.jarjan.xyz`;

  const handleCopy = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }, [tips]);

  if (!gameover) return null;

  return (
    <div class="share">
      {navigator.clipboard && (
        <button class="share__button" type="button" onClick={handleCopy}>
          Нәтижені көшіріп алу
        </button>
      )}
      <a
        class="share__button"
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}`}
        target="_blank"
      >
        Твиттерге бөлісу
      </a>
    </div>
  );
};
