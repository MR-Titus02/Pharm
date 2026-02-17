import React from "react";

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex items-center gap-3 text-sky-700">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-300 border-t-sky-600" />
        <span className="text-sm font-medium tracking-wide">
          {message}
        </span>
      </div>
    </div>
  );
};

export default LoadingState;

