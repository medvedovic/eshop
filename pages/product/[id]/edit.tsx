import React from "react";
import Head from "next/head";
import { Navigation } from "../../../components/Navigation";
import { GetServerSideProps, NextPage } from "next";
import { Product as ProductModel } from "../../../models/product";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { ProductEditor } from "../../../components/ProductEditor";
import type { ProductDetailViewModel } from "../../../viewModels/ProductDetail";
import { deliveryClient } from "../../../constants/clients";

type ProductProps = {
  readonly product: ProductDetailViewModel;
};

const Edit: NextPage<ProductProps> = ({ product }) => {
  const router = useRouter();
  const [session, loading] = useSession();

  React.useEffect(() => {
    if (!session && !loading) {
      router.back();
    }
  }, [router, session, loading]);

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
          <ProductEditor product={product} />
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
      },
    },
  };
};

export default Edit;
