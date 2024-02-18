import React from "react";

const SendMessage = ({
  message = "Count me in",
  timestamp = "12:45 pm",
  isFile,
}) => {
  return (
    <div className="flex justify-end mb-2">
      {isFile ? (
        <div className="bg-green-500 text-white rounded-lg p-3 max-w-[70%]">
          <img
            src={message}
            alt="File Preview"
            className="h-48 w-auto mx-auto mb-1"
          />
          <p className="text-xs text-right">{timestamp}</p>
        </div>
      ) : (
        <div className="bg-green-500 text-white rounded-lg p-3 max-w-[70%]">
          <p className="text-sm">{message}</p>
          <p className="text-xs text-right mt-1">{timestamp}</p>
        </div>
      )}
    </div>
  );
};

export default SendMessage;
