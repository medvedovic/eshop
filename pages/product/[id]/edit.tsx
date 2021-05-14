import React from "react";
import Head from "next/head";
import { Navigation } from "../../../components/Navigation";
import { GetServerSideProps, NextPage } from "next";
import { Inline } from "../../../components/Inline";
import Link from "next/link";
import Image from "next/image";
import { client } from "../../../constants/client";
import { Product as ProductModel } from "../../../models/product";
import { Spacing } from "../../../constants/ui";
import { Stack } from "../../../components/Stack";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

type ProductDetailViewModel = {
  readonly name: string;
  readonly photoUrl: string;
  readonly price: number;
  readonly description: string;
};

type ProductProps = {
  readonly product: ProductDetailViewModel;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOperation = (): void => {};

const Edit: NextPage<ProductProps> = ({ product }) => {
  const router = useRouter();
  const [session, loading] = useSession();

  React.useEffect(() => {
    if (!session) {
      router.back();
    }
  }, [router, session]);

  if (!session || loading) {
    return null;
  }

  return (
    <>
      <Head>
        <title>pb175 eshop</title>
      </Head>
      <Navigation isAdmin />
      <div className="container">
        <main className="main product">
          <header className="product__header product__header--edit">
            <Inline spacing={Spacing.L} center>
              <Link href="/">
                <a className="product__back-btn">&lt; Späť na ponuku</a>
              </Link>
              <input
                className="product__title product__title--edit"
                placeholder="Názov"
                value={product.name}
                onChange={noOperation}
              />
            </Inline>
            <Inline spacing={Spacing.L} center>
              <button className="product__back-btn">Uložiť zmeny</button>
              <button className="product__back-btn">Zahodiť zmeny</button>
            </Inline>
          </header>
          <div className="product__img">
            <Image src={product.photoUrl} width={1080} height={810} />
          </div>
          <div className="product__details details">
            <Stack spacing={Spacing.L}>
              <input
                className="details__title details__title--edit"
                value={product.name}
                onChange={noOperation}
                placeholder="Vložte názov produktu"
              />
              <div className="details__price">
                <input
                  className="details__price details__price--edit"
                  placeholder="Vložte cenu v czk"
                  size={5}
                  pattern="[0-9]*"
                  value={product.price.toString()}
                  onChange={noOperation}
                />
                czk
              </div>
              <textarea
                placeholder="Vložte popis produktu"
                value={product.description}
                className="details__text details__text--edit"
                onChange={noOperation}
              />
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

export const getServerSideProps: GetServerSideProps<
  ProductProps,
  ProductParams
> = async (context) => {
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

export default Edit;
