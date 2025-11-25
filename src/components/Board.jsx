import cls from "classnames";
import { useContext } from "preact/hooks";

import { GameContext } from "../game/provider";

export const Tile = ({ value, isAnswered, isCorrect, isExact }) => {
  return (
    <span
      class={cls("board__tile", {
        empty: value === "",
        answered: isAnswered,
        correct: isCorrect,
        exact: isExact,
      })}
    >
      {value}
    </span>
  );
};

export const Board = () => {
  const { answers, guess, chance, tips } = useContext(GameContext);

  return (
    <div class="board">
      {answers.map((answer, i) => {
        if (answer !== "") {
          return (
            <div key={`answer-${i}`} class="board__tiles">
              {answer.split("").map((letter, j) => (
                <Tile
                  key={j}
                  value={letter}
                  isAnswered
                  isCorrect={tips[i]?.[j]?.isCorrect}
                  isExact={tips[i]?.[j]?.isExact}
                />
              ))}
            </div>
          );
        } else if (i === chance) {
          return (
            <div key={`answer-${i}`} class="board__tiles">
              <Tile value={guess[0] || ""} />
              <Tile value={guess[1] || ""} />
              <Tile value={guess[2] || ""} />
              <Tile value={guess[3] || ""} />
              <Tile value={guess[4] || ""} />
            </div>
          );
        }

        return (
          <div key={`answer-${i}`} class="board__tiles">
            <Tile value={""} />
            <Tile value={""} />
            <Tile value={""} />
            <Tile value={""} />
            <Tile value={""} />
          </div>
        );
      })}
    </div>
  );
};
