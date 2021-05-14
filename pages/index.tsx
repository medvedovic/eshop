import { Navigation } from "../components/Navigation";
import Head from "next/head";
import React from "react";
import { ProductTile } from "../components/ProductTile";
import { ProductGrid } from "../components/ProductGrid";
import { GetStaticProps, NextPage } from "next";
import { deliveryClient } from "../constants/clients";
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
  readonly products: readonly ProductListingViewModel[];
};

const Index: NextPage<IndexProps> = ({ products }) => (
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
          <ProductGrid>
            {products.map((product, index) => (
              <ProductTile
                photoUrl={product.photoUrl}
                key={index}
                title={product.name}
                price={product.price}
                productUrl={`/product/${product.productUrl}`}
              />
            ))}
            {products
              .filter((_, i) => i < 2)
              .map((product, index) => (
                <ProductTile
                  photoUrl={product.photoUrl}
                  key={index}
                  title={product.name}
                  price={product.price}
                  productUrl={`/product/${product.productUrl}`}
                />
              ))}
          </ProductGrid>
        </MainSection>
        <MainSection title="Category #1">
          <ProductGrid isCompact={products.length < 5}>
            {products.map((product, index) => (
              <ProductTile
                photoUrl={product.photoUrl}
                key={index}
                title={product.name}
                price={product.price}
                productUrl={`/product/${product.productUrl}`}
              />
            ))}
            {products
              .filter((_, i) => i < 1)
              .map((product, index) => (
                <ProductTile
                  photoUrl={product.photoUrl}
                  key={index}
                  title={product.name}
                  price={product.price}
                  productUrl={`/product/${product.productUrl}`}
                />
              ))}
          </ProductGrid>
        </MainSection>
      </main>
    </div>
  </>
);

type ProductListingViewModel = {
  readonly name: string;
  readonly photoUrl: string;
  readonly price: number;
  readonly productUrl: string;
};

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const response = await deliveryClient.items<Product>().toPromise();

  return {
    props: {
      products: response.items.map((item) => ({
        name: item.name.value,
        photoUrl: item.photo.value[0].url,
        price: item.price.value,
        productUrl: item.system.codename,
      })),
    },
  };
};

export default Index;
