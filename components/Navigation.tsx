import { Cart } from "iconoir-react";
import Link from "next/link";
import { signout } from "next-auth/client";
import React from "react";

import { Spacing } from "../constants/ui";
import { CartContext } from "../contexts/Cart";
import { Inline } from "./Inline";
import styles from "./Navigation.module.sass";

type NavigationProps = {
  readonly isAdmin: boolean;
};

const onSignOut: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
  e.preventDefault();
  signout();
};

export const Navigation: React.FC<NavigationProps> = ({ isAdmin }) => {
  const repo = React.useContext(CartContext);

  return (
    <div className="container">
      <nav className={styles.navigation}>
        <Inline spacing={Spacing.L} center>
          <div className={styles.navigation__logo}>
            <div className="logo">
              <div className="placeholder">
                <svg>
                  <line x1="0" y1="0" x2="100%" y2="100%" strokeWidth="2" />
                  <line x1="0" y1="100%" x2="100%" y2="0" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          {isAdmin && (
            <Link href="/invoices">
              <a href="#" className={styles.navigation__link}>
                Objednávky
              </a>
            </Link>
          )}
          {isAdmin && (
            <a
              id="sign-out"
              href="#"
              onClick={onSignOut}
              className={styles.navigation__link}
            >
              Odhlásiť
            </a>
          )}
        </Inline>
        <div className={styles["navigation__cart-btn"]}>
          <Link href="cart/01">
            <button className="button cart-btn">
              <Cart size={30} />
              Košík: {repo.get().totalCost} Kč
            </button>
          </Link>
        </div>
      </nav>
    </div>
  );
};
