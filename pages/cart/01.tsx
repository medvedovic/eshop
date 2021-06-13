import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/client";
import React from "react";

import { Inline } from "../../components/Inline";
import { Navigation } from "../../components/Navigation";
import { Stack } from "../../components/Stack";
import { Spacing } from "../../constants/ui";
import { CartContext } from "../../contexts/Cart";
import { findByProductId, getCodeNames } from "../../repositories/utils";
import { ProductServerModel } from "../../serverModels/Product";

const fetchCart = async (codenames: readonly string[]) => {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ codenames }),
  });
  return await response.json();
};

const Cart01: NextPage = () => {
  const repo = React.useContext(CartContext);
  const [state, setState] = React.useState<readonly ProductServerModel[]>([]);
  React.useEffect(() => {
    const fetch = async () => {
      const codenames = getCodeNames(repo.get());
      const data = await fetchCart(codenames);
      setState(data.items);
    };
    fetch();
  }, [repo]);

  if (!state.length) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Košík | pb175 eshop </title>
      </Head>
      <Navigation isAdmin={false} />
      <div className="container">
        <main className="main">
          <h1 className="h1">Váš nákup:</h1>
          <ul className="tabs">
            <li className="tabs__item">1</li>
            <li className="tabs__item">2</li>
            <li className="tabs__item">3</li>
          </ul>
          <div className="cart">
            <Stack spacing={Spacing.L}>
              {state.map((product) => {
                const data = findByProductId(repo.get(), product.codename);
                return (
                  <div className="cart__item" key={product.name}>
                    <Inline spacing={Spacing.L}>
                      <div className="cart__item-img">
                        <Image
                          src={product.photoUrl}
                          width={200}
                          height={120}
                          objectFit="cover"
                        />
                      </div>
                      <div className="cart__item-text">
                        <h2 className="h2">{product.name}</h2>
                        <div className="price">{product.price} Kč</div>
                      </div>
                      <div className="cart__item-count">{data.count} ks</div>
                      <div className="cart__item-total">
                        {data.price * data.count} Kč
                      </div>
                    </Inline>
                  </div>
                );
              })}
            </Stack>
            <div className="cart__total">Spolu: {repo.get().totalCost}</div>
            <div className="cart__navigation">
              <Link href="/">
                <a className="cart__back">
                  <NavArrowLeft size={20} />
                  Späť do obchodu
                </a>
              </Link>
              <Link href="/cart/02">
                <a className="cart__next">
                  Pokračovať
                  <NavArrowRight size={20} />
                </a>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps: any = async ({ req: request }) => {
  const session = await getSession({ req: request });
  if (session) {
    return {
      redirect: {
        statusCode: 301,
        destination: "/",
      },
    };
  }
  return { props: {} };
};

export default Cart01;
