import React from "react";

import styles from "./Button.module.sass";

export const IconButton: React.FC<{
  readonly onClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ onClick, children }) => (
  <button className={styles["icon-button"]} onClick={onClick}>
    {children}
  </button>
);
