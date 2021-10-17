import { NavArrowLeft, ShoppingBag } from "iconoir-react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { Navigation } from "../../components/Navigation";
import { Stack } from "../../components/Stack";
import { Spacing } from "../../constants/ui";
import { CartContext } from "../../contexts/Cart";
import { OrderServerModel } from "../../serverModels/Order";

const post = async (body: OrderServerModel) =>
  await fetch("/api/invoice/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

const Cart02: NextPage = () => {
  const router = useRouter();
  const repo = React.useContext(CartContext);
  const products = repo.get().productIdCount.map(({ id: codename, count }) => ({
    codename,
    count,
  }));
  const submit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { target } = event as any;
    const response = await post({
      name: target.name.value,
      phone: target.phone.value,
      postalCode: target.postalCode.value,
      city: target.city.value,
      email: target.email.value,
      consent: target.consent.value,
      shipping: target.shipping.value,
      products,
    });
    if (response.redirected) {
      repo.clear();
      await router.push(response.url);
    }
  };

  return (
    <>
      <Head>
        <title>Košík | pb175 eshop </title>
      </Head>
      <Navigation isAdmin={false} />
      <div className="container">
        <main className="main">
          <h1 className="h1"> Váš nákup:</h1>
          <ul className="tabs">
            <li className="tabs__item">1</li>
            <li className="tabs__item">2</li>
            <li className="tabs__item">3</li>
          </ul>
          <div className="cart">
            <form className="form" onSubmit={submit}>
              <Stack spacing={Spacing.L}>
                <h2 className="h2">Zadajte kontaktné údaje:</h2>
                <Stack spacing={Spacing.M}>
                  <h3 className="h3">Kontaktné údaje:</h3>
                  <div className="form__row">
                    <input
                      name="name"
                      className="form__input"
                      placeholder="Meno a priezvisko"
                    />
                  </div>
                  <div className="form__row">
                    <input
                      name="email"
                      className="form__input"
                      placeholder="Váš email"
                    />
                    <input
                      name="phone"
                      className="form__input"
                      placeholder="Vaše telefónne číslo"
                    />
                  </div>
                </Stack>
                <Stack spacing={Spacing.M}>
                  <h3 className="h3">Doručovacie a fakturačné údaje:</h3>
                  <div className="form__row">
                    <input
                      name="shipping"
                      className="form__input"
                      placeholder="Ulica, číslo popisné"
                    />
                    <select
                      className="form__input form__input--compact"
                      disabled
                      name="city"
                    >
                      <option value="Brno" selected>
                        Brno
                      </option>
                    </select>
                  </div>
                  <div className="form__row">
                    <input
                      name="postalCode"
                      className="form__input form__input--compact"
                      placeholder="PSČ"
                    />
                  </div>
                </Stack>
                <div className="form__row">
                  <label className="form__checkbox-label">
                    <input
                      className="form__checkbox"
                      type="checkbox"
                      name="consent"
                    />
                    Súhlasím so spracovaním osobných údajov
                  </label>
                </div>
                <button className="cart__submit" type="submit">
                    <ShoppingBag size={20} />
                    Záväzne objednať
                </button>
              </Stack>
            </form>
            <div className="cart__navigation">
              <Link href="/">
                <a className="cart__back">
                  <NavArrowLeft size={20} />
                  Späť do obchodu
                </a>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cart02;
