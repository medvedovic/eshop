import React from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";
import { Counter } from "../../components/Counter";
import { GetStaticPaths, GetStaticProps } from "next";
import { client } from "../../constants/client";
import { Product as ProductModel } from "../../models/product";
import { Inline } from "../../components/Inline";
import { Spacing } from "../../constants/ui";
import { Stack } from "../../components/Stack";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

type ProductDetailViewModel = {
  readonly name: string;
  readonly photoUrl: string;
  readonly price: number;
  readonly description: string;
};

type ProductProps = {
  readonly product: ProductDetailViewModel;
};

const Product: React.FC<ProductProps> = ({ product }) => {
  const [session, loading] = useSession();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{product.name} | pb175 eshop</title>
      </Head>
      <Navigation isAdmin={!!session} />
      <div className="container">
        <main className="main product">
          <header className="product__header">
            <Inline spacing={Spacing.L} center>
              <Link href="/">
                <a className="product__back-btn">&lt; Späť na ponuku</a>
              </Link>
              <h1 className="product__title">{product.name}</h1>
              {session && !loading && (
                <Link href={`${router.asPath}/edit`}>
                  <a className="product__back-btn">Upraviť</a>
                </Link>
              )}
            </Inline>
          </header>
          <div className="product__img">
            <Image src={product.photoUrl} width={1080} height={810} />
          </div>
          <div className="product__details details">
            <Stack spacing={Spacing.L}>
              <h1 className="details__title">{product.name}</h1>
              <Stack spacing={Spacing.XL}>
                <div className="details__head">
                  <div className="details__price">{product.price} czk</div>
                  <div className="details__count">
                    <Counter />
                  </div>
                </div>
                <button className="details__btn">Vložiť do košíku</button>
              </Stack>
              <div className="details__text">{product.description}</div>
            </Stack>
          </div>
        </main>
      </div>
    </>
  );
};

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
