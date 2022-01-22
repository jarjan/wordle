import cls from "classnames";

const Tile = ({ value, isAnswered, isCorrect, isInPosition }) => {
  return (
    <span
      class={cls("board__tile", {
        empty: value === "",
        answered: isAnswered,
        correct: isCorrect,
        inPosition: isInPosition,
      })}
    >
      {value}
    </span>
  );
};

const Board = ({ answers, guess, chance, tips }) => {
  return (
    <div class="board">
      {answers.map((answer, i) => {
        if (answer !== "") {
          return (
            <div key={`answer-${i}`} class="board__tiles">
              {answer.split("").map((letter, j) => (
                <Tile
                  value={letter}
                  isAnswered
                  isCorrect={tips[i]?.[j]?.isCorrect}
                  isInPosition={tips[i]?.[j]?.isInPosition}
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

export default Board;
