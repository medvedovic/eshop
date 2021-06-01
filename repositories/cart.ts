import { assert } from "../utils/assert";
import {
  addExistingItemToCart,
  addNewItemToCart,
  removeProductFromCart,
} from "./utils";

export type ProductCartModel = {
  readonly id: string;
  readonly price: number;
  readonly count: number;
};

export type Repository = {
  readonly add: (product: ProductCartModel) => void;
  readonly remove: (product: ProductCartModel) => void;
  readonly clear: () => void;
};

export type Cart = {
  readonly productIdCount: ReadonlyMap<string, number>;
  readonly totalCost: number;
};

const initialCart: Cart = {
  productIdCount: new Map(),
  totalCost: 0,
};

const localStorageCartKey = "cart-key";

const getParsedLocalStorageData = (): Cart => {
  const data = localStorage.getItem(localStorageCartKey);
  assert(data, `Item with ${localStorageCartKey} not found`);
  return JSON.parse(data);
};

const addItemToCart = (cart: Cart, product: ProductCartModel): Cart =>
  cart.productIdCount.has(product.id)
    ? addNewItemToCart(cart, product)
    : addExistingItemToCart(cart, product);

export const cartRepository: Repository = {
  add: (product) => {
    const parsedCart = getParsedLocalStorageData();
    const newCart = addItemToCart(parsedCart, product);
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
};
