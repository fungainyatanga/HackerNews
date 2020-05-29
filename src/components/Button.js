import React from "react";

const Button = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );
}

Button.defaultProps = { className: "" };

export default Button;