import classNames from "classnames";
import React from "react";

import { Spacing } from "../constants/ui";
import styles from "./Inline.module.sass";

type InlineProps = {
  readonly spacing: Spacing;
  readonly center?: boolean;
};

export const Inline: React.FC<InlineProps> = ({
  center,
  children,
  spacing,
}) => (
  <ul
    className={classNames(styles.inline, {
      [styles["inline--center"]]: center,
    })}
    style={{
      "--inline-spacing": spacing,
    }}
  >
    {React.Children.map(children, (child, index) => {
      return (
        child && (
          <li className={styles.inline__item} key={index}>
            {child}
          </li>
        )
      );
    })}
  </ul>
);
