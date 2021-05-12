import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Navigation } from "../../components/Navigation";
import { Counter } from "../../components/Counter";

const Product: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Head>
        <title>pb175 eshop</title>
      </Head>
      <Navigation isAdmin={false} />
      <div className="container">
        <main className="main product">
          <div className="product__wrapper">
            <div className="product__img">
              <div className="placeholder">
                <svg>
                  <line x1="0" y1="0" x2="100%" y2="100%" strokeWidth="2" />
                  <line x1="0" y1="100%" x2="100%" y2="0" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="product__details details">
              <div className="details__title">
                <h1 className="h1">{id}</h1>
              </div>
              <div className="details__head">
                <div className="details__price">3500 czk</div>
                <div className="details__count">
                  <Counter />
                </div>
              </div>
              <button className="details__btn">Vložiť do košíku</button>
              <div className="details__text">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis
                vel sapien. Fusce aliquam vestibulum ipsum.
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Product;
