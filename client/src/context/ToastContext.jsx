import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    const id = ++idCounter;
    const timeout = toast.timeout ?? 3500;

    setToasts((current) => [
      ...current,
      {
        id,
        type: toast.type ?? "info",
        message: toast.message,
      },
    ]);

    if (timeout > 0) {
      setTimeout(() => removeToast(id), timeout);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-end px-4 sm:top-4 sm:px-6">
        <div className="flex w-full max-w-sm flex-col gap-2">
          {toasts.map((toast) => {
            const base =
              "pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2 text-xs shadow-lg";
            const stylesByType = {
              success:
                "border-emerald-500/40 bg-emerald-950/70 text-emerald-100",
              error: "border-rose-500/40 bg-rose-950/70 text-rose-100",
              info: "border-sky-500/40 bg-sky-950/70 text-sky-100",
            };

            return (
              <div
                key={toast.id}
                className={`${base} ${
                  stylesByType[toast.type] || stylesByType.info
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{toast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="ml-1 text-[10px] text-slate-300 hover:text-white"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

