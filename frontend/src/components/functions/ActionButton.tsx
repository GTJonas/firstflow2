import React, { MouseEventHandler } from "react";

interface ActionButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return <button onClick={onClick}></button>;
};

export default ActionButton;
