import React from "react";
import styles from "./Inline.module.sass";
import classNames from "classnames";

export enum Spacing {
  L = "20px",
}

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
