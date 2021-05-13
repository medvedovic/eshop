import React from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Counter } from "../../components/Counter";
import { GetStaticPaths, GetStaticProps } from "next";
import { client } from "../../constants/client";
import { Product as ProductModel } from "../../models/product";
import { Inline, Spacing } from "../../components/Inline";

type ProductDetailViewModel = {
  readonly name: string;
  readonly photoUrl: string;
  readonly price: number;
  readonly description: string;
};

type ProductProps = {
  readonly product: ProductDetailViewModel;
};

const Product: React.FC<ProductProps> = ({ product }) => (
  <>
    <Head>
      <title>{product.name} | pb175 eshop</title>
    </Head>
    <Navigation isAdmin={false} />
    <div className="container">
      <main className="main product">
        <header className="product__header">
          <Inline spacing={Spacing.L} center>
            <Link href="/">
              <a className="product__back-btn">&lt; Späť na ponuku</a>
            </Link>
            <h1 className="product__title">{product.name}</h1>
          </Inline>
        </header>
        <div className="product__img">
          <Image src={product.photoUrl} width={1080} height={810} />
        </div>
        <div className="product__details details">
          <div className="details__title">
            <h1 className="h1">{product.name}</h1>
          </div>
          <div className="details__head">
            <div className="details__price">{product.price} czk</div>
            <div className="details__count">
              <Counter />
            </div>
          </div>
          <button className="details__btn">Vložiť do košíku</button>
          <div className="details__text">{product.description}</div>
        </div>
      </main>
    </div>
  </>
);

type ProductParams = {
  readonly id: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await client
    .items<ProductModel>()
    .type("product")
    .toPromise();
  const paths = response.items.map((item) => ({
    params: {
      id: item.system.codename,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ProductProps, ProductParams> =
  async (context) => {
    const response = await client
      .items<ProductModel>()
      .inFilter("system.codename", [context.params.id])
      .toPromise();

    const data = response.getFirstItem();

    return {
      props: {
        product: {
          name: data.name.value,
          photoUrl: data.photo.value[0].url,
          price: data.price.value,
          description: data.description.value,
        },
      },
    };
  };

export default Product;
