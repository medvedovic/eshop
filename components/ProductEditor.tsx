import React from "react";
import { Inline } from "./Inline";
import { Spacing } from "../constants/ui";
import Link from "next/link";
import Image from "next/image";
import { Stack } from "./Stack";
import type { ProductDetailViewModel } from "../viewModels/ProductDetail";
import { useRouter } from "next/router";
import { createNewVersion } from "../actions/createNewVersion";
import { updateProduct } from "../actions/updateProduct";
import { publishProduct } from "../actions/publishProduct";

type ProductEditorProps = {
  readonly product: ProductDetailViewModel;
};

export const ProductEditor: React.FC<ProductEditorProps> = ({ product }) => {
  const router = useRouter();
  const [productName, setProductName] = React.useState(product.name);
  const [productPrice, setProductPrice] = React.useState(
    product.price.toString()
  );
  const [productDescription, setProductDescription] = React.useState(
    product.description
  );
  const changeProductName: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { value } = event.target;
    setProductName(() => value);
  };
  const changeProductPrice: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { value } = event.target;
    setProductPrice(() => value);
  };
  const changeProductDescription: React.ChangeEventHandler<HTMLTextAreaElement> =
    (event) => {
      const { value } = event.target;
      setProductDescription(() => value);
    };

  const submit = async () => {
    const productCodename = router.query.id as string;
    await createNewVersion(productCodename);
    await updateProduct(productCodename, {
      productName,
      productPrice: parseInt(productPrice),
      productDescription,
    });
    await publishProduct(productCodename);
  };

  return (
    <>
      <header className="product__header product__header--edit">
        <Inline spacing={Spacing.L} center>
          <Link href="/">
            <a className="product__back-btn">&lt; Späť na ponuku</a>
          </Link>
          <input
            className="product__title product__title--edit"
            placeholder="Názov"
            value={productName}
            onChange={changeProductName}
          />
        </Inline>
        <Inline spacing={Spacing.L} center>
          <button onClick={submit} className="product__back-btn">
            Uložiť zmeny
          </button>
          <button onClick={() => router.back()} className="product__back-btn">
            Zahodiť zmeny
          </button>
        </Inline>
      </header>
      <div className="product__img">
        <Image src={product.photoUrl} width={1080} height={810} />
      </div>
      <div className="product__details details">
        <Stack spacing={Spacing.L}>
          <input
            className="details__title details__title--edit"
            value={productName}
            onChange={changeProductName}
            placeholder="Vložte názov produktu"
          />
          <div className="details__price">
            <input
              className="details__price details__price--edit"
              placeholder="Vložte cenu v czk"
              size={5}
              pattern="[0-9]*"
              value={productPrice}
              onChange={changeProductPrice}
            />
            czk
          </div>
          <textarea
            placeholder="Vložte popis produktu"
            value={productDescription}
            className="details__text details__text--edit"
            onChange={changeProductDescription}
          />
        </Stack>
      </div>
    </>
  );
};
