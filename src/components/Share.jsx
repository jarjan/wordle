import { useCallback, useContext } from "preact/hooks";

import { GameContext } from "../game/provider";
import { todayWord } from "../game/hooks";

const convertTip = (row) => {
  return Array.from({ length: 5 })
    .map((_, i) => {
      if (row[i] && row[i].isExact) {
        return "\u{1F7E9}";
      } else if (row[i] && row[i].isCorrect) {
        return "\u{1F7E8}";
      }
      return "\u{2B1C}\u{FE0F}";
    })
    .join("");
};

export const Share = () => {
  const { gameover, won, answers, tips, untilNextWord, setToast } =
    useContext(GameContext);
  const played = answers.filter((answer) => answer !== "").length;
  const result = tips.slice(0, played).map(convertTip).join("\n");
  const url = "https://wordle.jarjan.xyz";
  const text = `Қазақша Wordle! ${won ? played : "X"}/6\n\n${result}`;

  const handleCopy = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${text}\n\n${url}`)
        .then(() => setToast("Нәтиже көшірілді!"))
        .catch(() => setToast("Көшіру мүмкін болмады :("));
    }
  }, [text, setToast]);

  if (!gameover) return null;

  return (
    <div class="share">
      <p class="share__title">
        {won ? (
          `Жарайсың! ${played}/6`
        ) : (
          <>
            Сөз: <strong>{todayWord.toUpperCase()}</strong>
          </>
        )}
      </p>
      <p class="share__timer">
        Келесі сөзге дейін
        <strong>{untilNextWord}</strong>
      </p>
      {navigator.clipboard && (
        <button class="share__button" type="button" onClick={handleCopy}>
          Нәтижені көшіріп алу
        </button>
      )}
      <a
        class="share__button secondary"
        href={`https://www.threads.com/intent/post?text=${encodeURIComponent(
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
