import React from "react";

const Dropdown = ({ children }) => {
  return (
    <div className="origin-top-right absolute z-50 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1" role="none">
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
