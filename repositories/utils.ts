import { assert } from "../utils/assert";
import { Cart, ProductCartModel } from "./cart";

export const addNewItemToCart = (
  { productIdCount, totalCost }: Cart,
  product: ProductCartModel
): Cart => {
  assert(
    !productIdCount.has(product.id),
    `Cart already contains product ${product.id}`
  );

  const newProductIdCount = new Map([
    ...Array.from(productIdCount.entries()),
    [product.id, product.count],
  ]);

  return {
    productIdCount: newProductIdCount,
    totalCost: totalCost + product.price * product.count,
  };
};

export const addExistingItemToCart = (
  { productIdCount, totalCost }: Cart,
  product: ProductCartModel
): Cart => {
  assert(
    productIdCount.has(product.id),
    `Product ${product.id} not present in cart`
  );

  const thereCount = productIdCount.get(product.id);

  const newProductIdCount = new Map(
    Array.from(productIdCount.entries()).map(([_productId, _count]) =>
      _productId !== product.id
        ? [_productId, _count]
        : [product.id, product.count]
    )
  );

  return {
    productIdCount: newProductIdCount,
    totalCost: totalCost + product.price * (product.count - thereCount),
  };
};

export const removeProductFromCart = (
  { productIdCount, totalCost }: Cart,
  product: ProductCartModel
): Cart => {
  assert(
    productIdCount.has(product.id),
    `Product ${product.id} not present in cart`
  );
  const newProductIdCount = new Map(
    Array.from(productIdCount.entries()).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([productId, _count]) => productId !== product.id
    )
  );
  return {
    productIdCount: newProductIdCount,
    totalCost: totalCost - product.price * product.count,
  };
};
