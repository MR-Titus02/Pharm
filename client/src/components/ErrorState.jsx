import React from "react";

const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-6 text-center text-sm text-rose-700">
      <p className="mb-3 font-medium">Unable to load data</p>
      <p className="mb-4 text-xs text-rose-600/90">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;

