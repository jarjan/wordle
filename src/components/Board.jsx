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

const Row = ({ index, className, children }) => (
  <div class={cls("board__tiles", className)} style={{ "--row": index }}>
    {children}
  </div>
);

export const Board = () => {
  const { answers, guess, chance, tips, won, revealRow, shake } =
    useContext(GameContext);

  return (
    <div class="board">
      {answers.map((answer, i) => {
        if (answer !== "") {
          return (
            <Row
              key={i}
              index={i}
              className={{
                reveal: i === revealRow,
                win: won && i === revealRow,
              }}
            >
              {answer.split("").map((letter, j) => (
                <Tile
                  key={j}
                  value={letter}
                  isAnswered
                  isCorrect={tips[i]?.[j]?.isCorrect}
                  isExact={tips[i]?.[j]?.isExact}
                />
              ))}
            </Row>
          );
        }

        const letters = i === chance ? guess : "";
        return (
          <Row key={i} index={i} className={{ shake: i === chance && shake }}>
            {[0, 1, 2, 3, 4].map((j) => (
              <Tile key={j} value={letters[j] || ""} />
            ))}
          </Row>
        );
      })}
    </div>
  );
};
