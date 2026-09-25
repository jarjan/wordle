import { useEffect, useRef } from "preact/hooks";

import { Tile } from "./Board";

const Example = ({ word, index, tip, children }) => (
  <div class="help__example">
    <div class="board__tiles">
      {word.split("").map((letter, i) => (
        <Tile
          key={i}
          value={letter}
          isAnswered={i === index}
          isCorrect={i === index && tip === "correct"}
          isExact={i === index && tip === "exact"}
        />
      ))}
    </div>
    <p>{children}</p>
  </div>
);

export const Help = ({ onClose }) => {
  const confirmRef = useRef();

  useEffect(() => {
    confirmRef.current?.focus();

    // Capture keys before the game's handler so typing doesn't reach the board.
    const handleKeyDown = (e) => {
      if (e.key === "Tab") return;
      e.stopImmediatePropagation();
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  return (
    <div class="help" onClick={onClose}>
      <div
        class="help__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          class="help__close"
          type="button"
          aria-label="Жабу"
          onClick={onClose}
        >
          ×
        </button>
        <h2 id="help-title">Қалай ойнау керек?</h2>
        <p>Жасырын сөзді 6 әрекетте табыңыз.</p>
        <p>
          Әр болжам — сөздікте бар 5 әріпті сөз. Жіберу үшін ↵ батырмасын
          басыңыз.
        </p>
        <p>Әр болжамнан кейін әріптердің түсі өзгереді:</p>

        <Example word="батыр" index={0} tip="exact">
          <strong>Б</strong> әрпі сөзде бар және дұрыс орында тұр.
        </Example>
        <Example word="қалың" index={2} tip="correct">
          <strong>Л</strong> әрпі сөзде бар, бірақ басқа орында.
        </Example>
        <Example word="керек" index={2} tip="absent">
          <strong>Р</strong> әрпі сөзде жоқ.
        </Example>

        <p>Күн сайын жаңа сөз!</p>
        <button
          ref={confirmRef}
          class="share__button"
          type="button"
          onClick={onClose}
        >
          Түсінікті!
        </button>
      </div>
    </div>
  );
};
