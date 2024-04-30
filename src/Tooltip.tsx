import React from "react";

const Tooltip = ({ content, children }) => {
  const [visible, setVisible] = React.useState(false);
  const handleMouseEnter = () => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  };
  const handleMouseLeave = () => setVisible(false);

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className="text-[8px] absolute z-50 bottom-[0px] -right-[70px] bg-gray-500 text-white rounded-md px-3 py-2 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
