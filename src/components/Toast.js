import cls from "classnames";
import { createContext } from "preact";
import { useState } from "preact/hooks";

export const ToastContext = createContext({ setToast: () => {} });

const Toast = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const setToast = (message) => {
    setShowToast(true);
    setToastMessage(message);

    setTimeout(() => {
      setShowToast(false);
      setToastMessage("");
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ setToast }}>
      <div className={cls("toast", { show: showToast })}>{toastMessage}</div>
      {children}
    </ToastContext.Provider>
  );
};

export default Toast;
