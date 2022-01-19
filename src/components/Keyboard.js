const keys = [
  [
    { value: "ә", label: "Ә" },
    { value: "і", label: "І" },
    { value: "ң", label: "Ң" },
    { value: "ғ", label: "Ғ" },
    { value: "ү", label: "Ү" },
    { value: "ұ", label: "Ұ" },
    { value: "қ", label: "Қ" },
    { value: "ө", label: "Ө" },
    { value: "һ", label: "Һ" },
  ],
  [
    { value: "й", label: "Й" },
    { value: "ц", label: "Ц" },
    { value: "у", label: "У" },
    { value: "к", label: "К" },
    { value: "е", label: "Е" },
    { value: "н", label: "Н" },
    { value: "г", label: "Г" },
    { value: "ш", label: "Ш" },
    { value: "щ", label: "Щ" },
    { value: "з", label: "З" },
    { value: "х", label: "Х" },
    { value: "ъ", label: "Ъ" },
  ],
  [
    { value: "ф", label: "Ф" },
    { value: "ы", label: "Ы" },
    { value: "в", label: "В" },
    { value: "а", label: "А" },
    { value: "п", label: "П" },
    { value: "р", label: "Р" },
    { value: "о", label: "О" },
    { value: "л", label: "Л" },
    { value: "д", label: "Д" },
    { value: "ж", label: "Ж" },
    { value: "э", label: "Э" },
  ],
  [
    { value: "↵", label: "↵" },
    { value: "я", label: "Я" },
    { value: "ч", label: "Ч" },
    { value: "с", label: "С" },
    { value: "м", label: "М" },
    { value: "и", label: "И" },
    { value: "т", label: "Т" },
    { value: "ь", label: "Ь" },
    { value: "б", label: "Б" },
    { value: "ю", label: "Ю" },
    { value: "←", label: "←" },
  ],
];

const Keyboard = ({ onLetter, onRemove, onEnter }) => {
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
      {keys.map((row, index) => {
        return (
          <div class="keyboard__row" key={`keyboard-row-${index}`}>
            {row.map((key) => {
              return (
                <button
                  id={key.value}
                  class="keyboard__key"
                  key={`keyboard-key-${key.value}`}
                  type="button"
                  onClick={handleClick}
                >
                  {key.label}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Keyboard;
