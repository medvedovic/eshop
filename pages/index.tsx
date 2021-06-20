import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/client";
import React from "react";

import { Navigation } from "../components/Navigation";
import { ProductGrid } from "../components/ProductGrid";
import { ProductTile } from "../components/ProductTile";
import { deliveryClient } from "../constants/clients";
import { Product } from "../models/product";
import { groupByMultiple } from "../utils/groupBy";

type MainSectionProps = {
  readonly title: string;
};

const MainSection: React.FC<MainSectionProps> = ({ title, children }) => (
  <section className="main__section">
    <h1 className="h1">{title}</h1>
    {children}
  </section>
);

type GroupedProduct = readonly [
  group: string,
  products: readonly ProductListingViewModel[]
];

type IndexProps = {
  readonly groupedProducts: readonly GroupedProduct[];
};

const Index: NextPage<IndexProps> = ({ groupedProducts }) => {
  const [session] = useSession();
  const [searchPhrase, setSearchPhrase] = React.useState<string>("");

  return (
    <>
      <Head>
        <title>pb175 eshop</title>
      </Head>
      <Navigation isAdmin={!!session} />
      <div className="container">
        <main className="main">
          <div className="search">
            <input
              className="search__box"
              placeholder="Vyhľadať"
              value={searchPhrase}
              onChange={(e) => setSearchPhrase(e.target.value)}
            />
          </div>
          {groupedProducts
            .filter(([group, products]) => {
              const groupHit =
                !searchPhrase ||
                group.toLowerCase().includes(searchPhrase.toLowerCase());
              return (
                groupHit ||
                products.some((product) =>
                  product.name
                    .toLowerCase()
                    .includes(searchPhrase.toLowerCase())
                )
              );
            })
            .map(([group, products], index) => (
              <MainSection title={group} key={index}>
                <ProductGrid isCompact={products.length < 5}>
                  {products
                    .filter((product) => {
                      return (
                        !searchPhrase ||
                        product.name
                          .toLowerCase()
                          .includes(searchPhrase.toLowerCase()) ||
                        group.toLowerCase().includes(searchPhrase.toLowerCase())
                      );
                    })
                    .map((product, index) => (
                      <ProductTile
                        codename={product.codename}
                        key={index}
                        photoUrl={product.photoUrl}
                        price={product.price}
                        productUrl={`/product/${product.productUrl}`}
                        title={product.name}
                      />
                    ))}
                </ProductGrid>
              </MainSection>
            ))}
        </main>
      </div>
    </>
  );
};

type ProductListingViewModel = {
  readonly codename: string;
  readonly name: string;
  readonly photoUrl: string;
  readonly price: number;
  readonly productUrl: string;
};

const getTaxonomyKeys = (product: Product) =>
  product.productCategories.value.map((taxonomy) => taxonomy.name);

const toProductViewModel = (product: Product): ProductListingViewModel => ({
  codename: product.system.codename,
  name: product.name.value,
  photoUrl: product.photo.value[0].url,
  price: product.price.value,
  productUrl: product.system.codename,
});

const toGroupedProductViewModels = ([group, products]: readonly [
  group: string,
  products: readonly Product[]
]): readonly [group: string, products: readonly ProductListingViewModel[]] => [
  group,
  products.map(toProductViewModel),
];

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const response = await deliveryClient
    .items<Product>()
    .type("product")
    .toPromise();

  const groupedProductViewModels = groupByMultiple(
    response.items,
    getTaxonomyKeys
  ).map(toGroupedProductViewModels);

  return {
    props: {
      groupedProducts: groupedProductViewModels,
    },
  };
};

export default Index;
