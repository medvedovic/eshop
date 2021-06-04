import classNames from "classnames";
import React from "react";

import styles from "./ProductGrid.module.sass";

type ProductGridProps = {
  readonly isCompact?: boolean;
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  children,
  isCompact,
}) => (
  <ul
    className={classNames(styles.grid, {
      [styles["grid--compact"]]: isCompact,
    })}
  >
    {React.Children.map(children, (child, index) => (
      <li key={index} className={styles.grid__item}>
        <div className={styles["grid__item-content"]}>{child}</div>
      </li>
    ))}
  </ul>
);
