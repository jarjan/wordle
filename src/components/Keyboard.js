import cls from "classnames";

const Key = ({ value, label, onClick }) => (
  <button
    id={value}
    class={cls("keyboard__key", {
      special: ["←", "↵"].includes(value),
    })}
    type="button"
    onClick={onClick}
  >
    {label}
  </button>
);

const Keyboard = ({ onLetter, onRemove, onEnter, keys }) => {
  const handleClick = (e) => {
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
  };

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
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
