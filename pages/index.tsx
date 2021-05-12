import { Navigation } from "../components/Navigation";
import Head from "next/head";
import React from "react";
import { ProductTile } from "../components/ProductTile";
import { ProductGrid } from "../components/ProductGrid";
import { NextPage } from "next";

type MainSectionProps = {
  readonly title: string;
};

const MainSection: React.FC<MainSectionProps> = ({ title, children }) => (
  <section className="main__section">
    <h1 className="h1">{title}</h1>
    {children}
  </section>
);

const Index: NextPage = () => (
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
            {[0, 1, 2, 3, 4].map((el) => (
              <ProductTile
                key={el}
                title={`Product title ${el}`}
                price={(el + 1) * 70}
              />
            ))}
          </ProductGrid>
        </MainSection>
        <MainSection title="Category #2">
          <ProductGrid isCompact>
            {[0, 1, 2, 3].map((el) => (
              <ProductTile
                key={el}
                title={`Product title ${el}`}
                price={(el + 1) * 70}
              />
            ))}
          </ProductGrid>
        </MainSection>
      </main>
    </div>
  </>
);

export default Index;
