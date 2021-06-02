import { assert } from "../utils/assert";
import {
  updateExistingProductInCart,
  addNewProductToCart,
  removeProductFromCart,
} from "./utils";

export type ProductCartModel = {
  readonly id: string;
  readonly price: number;
  readonly count: number;
};

type CartRepository = {
  readonly add: (product: ProductCartModel) => Cart;
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

export const cartRepository: CartRepository = {
  get: getParsedLocalStorageData,
  add: (product) => {
    const parsedCart = getParsedLocalStorageData();
    const newCart = addNewProductToCart(parsedCart, product);
    localStorage.setItem(localStorageCartKey, JSON.stringify(newCart));
    return newCart;
  },
  update: (product) => {
    const parsedCart = getParsedLocalStorageData();
    const newCart = updateExistingProductInCart(parsedCart, product);
    localStorage.setItem(localStorageCartKey, JSON.stringify(newCart));
    return newCart;
  },
  remove: (product) => {
    const parsedCart = getParsedLocalStorageData();
    const newCart = removeProductFromCart(parsedCart, product);
    localStorage.setItem(localStorageCartKey, JSON.stringify(newCart));
    return newCart;
  },
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
