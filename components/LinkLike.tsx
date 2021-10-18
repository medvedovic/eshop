import React from "react";

export const LinkLike: React.FC<{
  readonly onClick: React.MouseEventHandler;
}> = ({ onClick, children }) => (
  <a
    href="#"
    onClick={(event) => {
      event.preventDefault();
      onClick(event);
    }}
  >
    {children}
  </a>
);
