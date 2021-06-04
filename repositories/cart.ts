import { assert } from "../utils/assert";
import {
  addNewProductToCart,
  addOneProductToCart,
  removeProductFromCart,
  updateExistingProductInCart,
} from "./utils";

export type ProductCartModel = {
  readonly id: string;
  readonly price: number;
  readonly count: number;
};

type CartRepository = {
  readonly add: (product: ProductCartModel) => Cart;
  readonly addOne: (productId: string) => Cart;
  readonly clear: () => Cart;
  readonly get: () => Cart;
  readonly remove: (product: ProductCartModel) => Cart;
  readonly update: (product: ProductCartModel) => Cart;
  readonly initialize: () => void;
};

export type Cart = {
  readonly productIdCount: readonly ProductCartModel[];
  readonly totalCost: number;
};

export const initialCart: Cart = {
  productIdCount: [],
  totalCost: 0,
};

const localStorageCartKey = "cart-key";

const getParsedLocalStorageData = (): Cart => {
  const data = localStorage.getItem(localStorageCartKey);
  assert(data, `Item with ${localStorageCartKey} not found`);
  return JSON.parse(data);
};

const performOperationAndPersist =
  <T>(fn: (cart: Cart, params: T) => Cart) =>
  (params: T): Cart => {
    const parsedCart = getParsedLocalStorageData();
    const newCart = fn(parsedCart, params);
    localStorage.setItem(localStorageCartKey, JSON.stringify(newCart));
    return newCart;
  };

export const cartRepository: CartRepository = {
  get: getParsedLocalStorageData,
  add: (product) => performOperationAndPersist(addNewProductToCart)(product),
  addOne: (productId) =>
    performOperationAndPersist(addOneProductToCart)(productId),
  update: (product) =>
    performOperationAndPersist(updateExistingProductInCart)(product),
  remove: (product) =>
    performOperationAndPersist(removeProductFromCart)(product),
  clear: () => {
    localStorage.clear();
    return initialCart;
  },
  initialize: () => {
    if (!localStorage.getItem(localStorageCartKey)) {
      localStorage.setItem(localStorageCartKey, JSON.stringify(initialCart));
    }
  },
};
