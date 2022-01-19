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

export default Tile;
