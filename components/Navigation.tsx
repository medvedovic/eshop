import React from "react";
import styles from "./Navigation.module.sass";
import { Inline } from "./Inline";
import { Spacing } from "../constants/ui";
import { signout } from "next-auth/client";
import { Cart } from "iconoir-react";

type NavigationProps = {
  readonly isAdmin: boolean;
};

const onSignOut: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
  e.preventDefault();
  signout();
};

export const Navigation: React.FC<NavigationProps> = ({ isAdmin }) => (
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
          <a href="#" className={styles.navigation__link}>
            Objednávky
          </a>
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
        <button className="button cart-btn">
          <Cart size={30} />
          Košík: 0 czk
        </button>
      </div>
    </nav>
  </div>
);
