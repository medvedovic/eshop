import React from "react";
import styles from "./Stact.module.sass";
import { Spacing } from "../constants/ui";

type StackProps = {
  readonly spacing: Spacing;
};

export const Stack: React.FC<StackProps> = ({ children, spacing }) => (
  <ul className={styles.stack}>
    {React.Children.map(
      children,
      (child, index) =>
        child && (
          <li
            className={styles.stack__item}
            key={index}
            style={{
              ["--stack-spacing"]: spacing,
            }}
          >
            {child}
          </li>
        )
    )}
  </ul>
);
