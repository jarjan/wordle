import { useCallback, useContext } from "preact/hooks";

import { GameContext } from "../game/provider";

const convertTip = (row) => {
  return Array.from({ length: 5 })
    .map((_, i) => {
      if (row[i] && row[i].isExact) {
        return "🟩";
      } else if (row[i] && row[i].isCorrect) {
        return "🟨";
      }
      return "⬜️";
    })
    .join("");
};

export const Share = () => {
  const { gameover, tips } = useContext(GameContext);
  const table = tips.map(convertTip);
  const result = table
    .slice(0, table.findIndex((row) => row === "🟩🟩🟩🟩🟩") + 1)
    .join("\n");
  const url = "https://wordle.jarjan.xyz";
  const text = `Қазақша Wordle!\n\n${result}`;

  const handleCopy = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n\n${url}`);
    }
  }, [text]);

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
        href={`https://www.threads.net/intent/post?text=${encodeURIComponent(
          text,
        )}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
      >
        Threads-қа бөлісу
      </a>
    </div>
  );
};
