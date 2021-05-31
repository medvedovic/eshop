import React from "react";
import Head from "next/head";
import { Navigation } from "../../../components/Navigation";
import { GetServerSideProps, NextPage } from "next";
import { Product as ProductModel } from "../../../models/product";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { ProductEditor } from "../../../components/ProductEditor";
import { deliveryClient } from "../../../constants/clients";
import { TaxonomyViewModel } from "../../../viewModels/Taxonomy";
import { TaxonomyTerms } from "@kentico/kontent-delivery/_commonjs/models/taxonomy/taxonomy-models";
import type { ProductEditViewModel } from "../../../viewModels/ProductEdit";

type ProductProps = {
  readonly product: ProductEditViewModel;
  readonly taxonomies: readonly TaxonomyViewModel[];
};

const Edit: NextPage<ProductProps> = ({ product, taxonomies }) => {
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
          <ProductEditor product={product} taxonomies={taxonomies} />
        </main>
      </div>
    </>
  );
};

type ProductParams = {
  readonly id: string;
};

const toTaxonomyViewModel = ({
  name,
  codename,
}: TaxonomyTerms): TaxonomyViewModel => ({
  name,
  codename,
});

export const getServerSideProps: GetServerSideProps<
  ProductProps,
  ProductParams
> = async (context) => {
  const itemsResponse = await deliveryClient
    .items<ProductModel>()
    .inFilter("system.codename", [context.params.id])
    .toPromise();

  const data = itemsResponse.getFirstItem();

  const taxonomiesResponse = await deliveryClient
    .taxonomy("product_categories")
    .toPromise();
  const taxonomies = taxonomiesResponse.taxonomy.terms.map(toTaxonomyViewModel);

  return {
    props: {
      product: {
        name: data.name.value,
        photoUrl: data.photo.value[0].url,
        price: data.price.value,
        description: data.description.value,
        taxonomies: data.productCategories.value.map(
          (category) => category.codename
        ),
      },
      taxonomies,
    },
  };
};

export default Edit;
