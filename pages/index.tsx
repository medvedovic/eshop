import { Navigation } from "../components/Navigation";
import Head from "next/head";
import React from "react";
import { ProductTile } from "../components/ProductTile";
import { ProductGrid } from "../components/ProductGrid";
import { GetStaticProps, NextPage } from "next";
import { client } from "../constants/client";
import { Product } from "../models/product";

type MainSectionProps = {
  readonly title: string;
};

const MainSection: React.FC<MainSectionProps> = ({ title, children }) => (
  <section className="main__section">
    <h1 className="h1">{title}</h1>
    {children}
  </section>
);

type IndexProps = {
  readonly products: readonly ProductViewModel[];
};

const Index: NextPage<IndexProps> = ({ products }) => {
  return (
    <>
      <Head>
        <title>pb175 eshop</title>
      </Head>
      <Navigation isAdmin={false} />
      <div className="container">
        <main className="main">
          <div className="search">
            <input className="search__box" placeholder="Vyhľadať" />
          </div>
          <MainSection title="Category #1">
            <ProductGrid isCompact={products.length < 5}>
              {products.map((product, index) => (
                <ProductTile
                  photoUrl={product.photoUrl}
                  key={index}
                  title={product.name}
                  price={product.price}
                />
              ))}
            </ProductGrid>
          </MainSection>
        </main>
      </div>
    </>
  );
};

type ProductViewModel = {
  readonly price: number;
  readonly photoUrl: string;
  readonly name: string;
};

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const response = await client.items<Product>().toPromise();

  return {
    props: {
      products: response.items.map((item) => ({
        price: item.price.value,
        photoUrl: item.photo.value[0].url,
        name: item.name.value,
      })),
    },
  };
};

export default Index;
