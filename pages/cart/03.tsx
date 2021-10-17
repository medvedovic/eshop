import { NextPage } from "next";
import Head from "next/head";
import React from "react";

import { Navigation } from "../../components/Navigation";

const Cart03: NextPage = () => (
  <>
    <Head>
      <title>Košík | pb175 eshop </title>
    </Head>
    <Navigation isAdmin={false} />
    <div className="container">
      <main className="main">
        <ul className="tabs">
          <li className="tabs__item">1</li>
          <li className="tabs__item">2</li>
          <li className="tabs__item">3</li>
        </ul>
        <div className="cart">
          <h1 className="h1">Ďakujeme za Vašu objednávku</h1>
          <p>
            Vaša objednávka bola úspešne vytvorená a budeme Vás kontaktovať.
          </p>
        </div>
      </main>
    </div>
  </>
);

export default Cart03;
