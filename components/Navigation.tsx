import React from "react";
import styles from "./Navigation.module.sass";
import { Inline, Spacing } from "./Inline";

type NavigationProps = {
  readonly isAdmin: boolean;
};

export const Navigation: React.FC<NavigationProps> = ({ isAdmin }) => (
  <div className="container">
    <nav className={styles.navigation}>
      <Inline spacing={Spacing.L}>
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
          <ul className={styles.navigation__list}>
            <li className={styles["navigation__list-item"]}>
              <a href="#" className={styles.navigation__link}>
                Objednávky
              </a>
            </li>
          </ul>
        )}
      </Inline>
      <div className={styles["navigation__cart-btn"]}>
        <button className="button.cart-btn">Košík: 0 czk</button>
      </div>
    </nav>
  </div>
);
