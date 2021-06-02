import React from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {Navigation} from "../../components/Navigation";
import {Counter} from "../../components/Counter";
import {GetStaticPaths, GetStaticProps} from "next";
import {deliveryClient} from "../../constants/clients";
import {Product as ProductModel} from "../../models/product";
import {Inline} from "../../components/Inline";
import {Spacing} from "../../constants/ui";
import {Stack} from "../../components/Stack";
import {useRouter} from "next/router";
import {useSession} from "next-auth/client";
import type {ProductDetailViewModel} from "../../viewModels/ProductDetail";
import {CartContext} from "../../contexts/Cart";
import {findByProductId} from "../../repositories/utils";

type ProductProps = {
  readonly product: ProductDetailViewModel;
};

const Product: React.FC<ProductProps> = ({product}) => {
  const [session, loading] = useSession();
  const router = useRouter();
  const repo = React.useContext(CartContext);
  const isInCart = !!findByProductId(repo.get(), product.codename);
  const [count, setCount] = React.useState(0);
  const addProductToCart = () =>
    isInCart
      ? repo.update({
        id: product.codename,
        price: product.price,
        count,
      })
      : repo.add({
        id: product.codename,
        price: product.price,
        count,
      });

  return (
    <>
      <Head>
        <title>{product.name} | pb175 eshop</title>
      </Head>
      <Navigation isAdmin={!!session}/>
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
            <Image src={product.photoUrl} width={1080} height={810}/>
          </div>
          <div className="product__details details">
            <Stack spacing={Spacing.L}>
              <h1 className="details__title">{product.name}</h1>
              <Stack spacing={Spacing.XL}>
                <div className="details__head">
                  <div className="details__price">{product.price} czk</div>
                  <div className="details__count">
                    <Counter count={count} setCount={setCount}/>
                  </div>
                </div>
                <button onClick={addProductToCart} className="details__btn">
                  Vložiť do košíku
                </button>
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
  const response = await deliveryClient
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
    const response = await deliveryClient
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
          codename: data.system.codename,
        },
      },
    };
  };

export default Product;
