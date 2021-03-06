import classNames from "classnames";
import { Plus } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { CartContext } from "../contexts/Cart";
import { findByProductId } from "../repositories/utils";
import styles from "./ProductTile.module.sass";

type ProductTileProps = {
  readonly codename: string;
  readonly photoUrl?: string;
  readonly price: number;
  readonly productUrl?: string;
  readonly title: string;
};

export const ProductTile: React.FC<ProductTileProps> = ({
  codename,
  photoUrl,
  price,
  productUrl,
  title,
}) => {
  const repo = React.useContext(CartContext);
  const ref = React.useRef<HTMLButtonElement>(null);
  const isInCart = !!findByProductId(repo.get(), codename);
  const addProductToCart = (): void =>
    isInCart
      ? repo.addOne(codename)
      : repo.add({
          id: codename,
          price,
          count: 1,
        });

  return (
    <Link href={productUrl}>
      <a
        className={styles.tile}
        onClick={(e) => {
          if (e.target === ref.current) {
            e.preventDefault();
          }
        }}
      >
        <div className={styles.tile__img}>
          <Image src={photoUrl} layout="fill" />
        </div>
        <div className={styles["tile__title-box"]}>
          <div className={styles["tile__title-wrapper"]}>
            <span className={styles.tile__price}>{price} kč</span>
            <h2 className={classNames("h2", styles.tile__title)}>{title}</h2>
          </div>
          <div className={styles["tile__to-cart"]}>
            <button
              className="to-cart-btn"
              onClick={addProductToCart}
              ref={ref}
            >
              <Plus size={20} />
              Vložiť do košíku
            </button>
          </div>
        </div>
      </a>
    </Link>
  );
};
