import cls from "classnames";
import { useCallback } from "preact/hooks";

const Key = ({
  value,
  label,
  onClick,
  isAnswered,
  isCorrect,
  isInPosition,
}) => (
  <button
    id={value}
    class={cls("keyboard__key", {
      special: ["←", "↵"].includes(value),
      answered: isAnswered,
      correct: isCorrect,
      inPosition: isInPosition,
    })}
    type="button"
    onClick={onClick}
  >
    {label}
  </button>
);

const Keyboard = ({ onLetter, onRemove, onEnter, keys, keyTips }) => {
  const handleClick = useCallback(
    (e) => {
      switch (e.target.id) {
        case "↵":
          onEnter();
          break;
        case "←":
          onRemove();
          break;
        default:
          onLetter(e.target.id);
      }
    },
    [onEnter, onRemove, onLetter]
  );

  console.log(keyTips);

  return (
    <div class="keyboard">
      {keys.map((row, index) => (
        <div key={`keyboard-row-${index}`} class="keyboard__row">
          {row.map(({ value, label }) => (
            <Key
              key={`keyboard-key-${value}`}
              value={value}
              label={label}
              onClick={handleClick}
              isAnswered={keyTips[value]?.isAnswered}
              isCorrect={keyTips[value]?.isCorrect}
              isInPosition={keyTips[value]?.isInPosition}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
