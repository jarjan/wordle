import cls from "classnames";
import { useContext } from "preact/hooks";

import { GameContext } from "../game/provider";

export const Toast = () => {
  const { showToast, toastMessage } = useContext(GameContext);

  return (
    <div className={cls("toast", { show: showToast })}>{toastMessage}</div>
  );
};
