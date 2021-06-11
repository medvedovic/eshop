import { assert } from "../utils/assert";
import { Cart, ProductCartModel } from "./cart";

export const addNewProductToCart = (
  { productIdCount, totalCost }: Cart,
  product: ProductCartModel
): Cart => {
  assert(
    !productIdCount.some((p) => p.id === product.id),
    `Cart already contains product ${product.id}`
  );

  return {
    productIdCount: [...productIdCount, product],
    totalCost: totalCost + product.price * product.count,
  };
};

export const updateExistingProductInCart = (
  { productIdCount, totalCost }: Cart,
  product: ProductCartModel
): Cart => {
  assert(
    productIdCount.some((p) => p.id === product.id),
    `Product ${product.id} not present in cart`
  );

  const thereCount = findByProductId(
    { productIdCount, totalCost },
    product.id
  ).count;

  return {
    productIdCount: productIdCount.map((p) =>
      p.id !== product.id ? p : product
    ),
    totalCost: totalCost + product.price * (product.count - thereCount),
  };
};

export const removeProductFromCart = (
  { productIdCount, totalCost }: Cart,
  product: ProductCartModel
): Cart => {
  assert(
    productIdCount.some((p) => p.id === product.id),
    `Product ${product.id} not present in cart`
  );

  return {
    productIdCount: productIdCount.filter((p) => p.id !== product.id),
    totalCost: totalCost - product.price * product.count,
  };
};

export const addOneProductToCart = (
  { productIdCount, totalCost }: Cart,
  productId: string
): Cart => {
  assert(
    productIdCount.some((p) => p.id === productId),
    `Product ${productId} not present in cart`
  );

  return {
    productIdCount: productIdCount.map((p) =>
      p.id === productId ? { ...p, count: p.count + 1 } : p
    ),
    totalCost:
      totalCost +
      findByProductId({ productIdCount, totalCost }, productId).price,
  };
};

export const findByProductId = (
  cart: Cart,
  productId: string
): ProductCartModel => cart.productIdCount.find((p) => p.id === productId);

export const getCodeNames = (cart: Cart): readonly string[] =>
  cart.productIdCount.map((p) => p.id);
