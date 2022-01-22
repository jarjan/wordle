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

const Board = ({ answers, guess, chance, todayWord }) => {
  return (
    <div class="board">
      {answers.map((answer, index) => {
        if (answer !== "") {
          return (
            <div class="board__tiles">
              <Tile
                value={answer[0]}
                isAnswered
                isCorrect={todayWord.includes(answer[0])}
                isInPosition={answer[0] === todayWord[0]}
              />
              <Tile
                value={answer[1]}
                isAnswered
                isCorrect={todayWord.includes(answer[1])}
                isInPosition={answer[1] === todayWord[1]}
              />
              <Tile
                value={answer[2]}
                isAnswered
                isCorrect={todayWord.includes(answer[2])}
                isInPosition={answer[2] === todayWord[2]}
              />
              <Tile
                value={answer[3]}
                isAnswered
                isCorrect={todayWord.includes(answer[3])}
                isInPosition={answer[3] === todayWord[3]}
              />
              <Tile
                value={answer[4]}
                isAnswered
                isCorrect={todayWord.includes(answer[4])}
                isInPosition={answer[4] === todayWord[4]}
              />
            </div>
          );
        } else if (index === chance) {
          return (
            <div class="board__tiles">
              <Tile value={guess[0] || ""} />
              <Tile value={guess[1] || ""} />
              <Tile value={guess[2] || ""} />
              <Tile value={guess[3] || ""} />
              <Tile value={guess[4] || ""} />
            </div>
          );
        }

        return (
          <div key={`answer-${index}`} class="board__tiles">
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
