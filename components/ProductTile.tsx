import React from "react";
import Image from "next/image";
import styles from "./ProductTile.module.sass";
import classNames from "classnames";

type ProductTileProps = {
  readonly title: string;
  readonly price: number;
  readonly photoUrl?: string;
};

export const ProductTile: React.FC<ProductTileProps> = ({
  title,
  price,
  photoUrl,
}) => (
  <div className={styles.tile}>
    <div className={styles.tile__img}>
      <Image src={photoUrl} layout="fill" />
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
