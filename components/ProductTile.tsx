import React from "react";
import styles from "./ProductTile.module.sass";
import classNames from "classnames";

type ProductTileProps = {
  readonly title: string;
  readonly price: number;
};

export const ProductTile: React.FC<ProductTileProps> = ({ title, price }) => (
  <div className={styles.tile}>
    <div className={styles.tile__img}>
      <div className="placeholder">
        <svg>
          <line x1="0" y1="0" x2="100%" y2="100%" strokeWidth="2" />
          <line x1="0" y1="100%" x2="100%" y2="0" strokeWidth="2" />
        </svg>
      </div>
    </div>
    <div className={styles["tile__title-box"]}>
      <div className={styles["tile__title-left"]}>
        <h2 className={classNames("h2", styles.tile__title)}>{title}</h2>
        <div className={styles.tile__price}>{price} czk</div>
      </div>
      <div className={styles["tile__to-cart"]}>
        <button className="to-cart-btn">Vložiť do košíku</button>
      </div>
    </div>
  </div>
);
