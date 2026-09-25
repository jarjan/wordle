import { useCallback, useEffect, useState } from "preact/hooks";

import { Help } from "./Help";

const HELP_SEEN_KEY = "helpSeen";

export const Header = () => {
  const [showHelp, setShowHelp] = useState(false);

  // Show the rules automatically on the first visit.
  useEffect(() => {
    if (!window.localStorage.getItem(HELP_SEEN_KEY)) {
      setShowHelp(true);
    }
  }, []);

  const closeHelp = useCallback(() => {
    setShowHelp(false);
    window.localStorage.setItem(HELP_SEEN_KEY, "1");
  }, []);

  return (
    <div class="header">
      <span class="header__spacer" />
      <h1>Қазақша Wordle!</h1>
      <button
        class="header__button"
        type="button"
        aria-label="Ойын ережесі"
        onClick={() => setShowHelp(true)}
      >
        ?
      </button>
      {showHelp && <Help onClose={closeHelp} />}
    </div>
  );
};
