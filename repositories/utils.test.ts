import {
  addNewProductToCart,
  addOneProductToCart,
  removeProductFromCart,
  updateExistingProductInCart,
} from "./utils";

const product1 = {
  id: "001",
  count: 2,
  price: 20,
};

const product2 = {
  id: "002",
  count: 1,
  price: 30,
};

describe("addNewProductToCart", () => {
  it("given an empty cart returns a cart with one item", () => {
    const initial = {
      productIdCount: [],
      totalCost: 0,
    };
    const actual = addNewProductToCart(initial, product1);
    expect(actual).toEqual({
      productIdCount: [{ ...product1 }],
      totalCost: product1.price * product1.count,
    });
  });
  it("given a non-empty cart, returns a cart with added item", () => {
    const initial = {
      productIdCount: [product1],
      totalCost: product1.price * product1.count,
    };
    const actual = addNewProductToCart(initial, {
      ...product2,
    });
    expect(actual).toEqual({
      productIdCount: [{ ...product1 }, { ...product2 }],
      totalCost:
        product1.price * product1.count + product2.price * product2.count,
    });
  });
});

describe("updateExistingProductInCart", () => {
  it("given a non-empty cart, updates item count", () => {
    const initial = {
      productIdCount: [product1],
      totalCost: product1.price * product1.count,
    };
    const count = 3;
    const actual = updateExistingProductInCart(initial, {
      ...product1,
      count,
    });
    expect(actual).toEqual({
      productIdCount: [{ ...product1, count }],
      totalCost: product1.price * count,
    });
  });
});

describe("removeProductFromCart", () => {
  it("given a non-empty cart, removes and item", () => {
    const initial = {
      productIdCount: [product1, product2],
      totalCost:
        product1.price * product1.count + product2.price * product2.count,
    };
    const actual = removeProductFromCart(initial, {
      ...product1,
    });
    expect(actual).toEqual({
      productIdCount: [{ ...product2 }],
      totalCost: product2.price,
    });
  });
  it("given a non-empty cart, returns an empty cart", () => {
    const initial = {
      productIdCount: [product1],
      totalCost: product1.price * product1.count,
    };
    const actual = removeProductFromCart(initial, {
      ...product1,
    });
    expect(actual).toEqual({
      productIdCount: [],
      totalCost: 0,
    });
  });
});

describe("addOneProductToCart", () => {
  it("given a non-empty cart, increments count of product", () => {
    const initial = {
      productIdCount: [product1],
      totalCost: product1.price * product1.count,
    };
    const actual = addOneProductToCart(initial, product1.id);
    expect(actual).toEqual({
      productIdCount: [
        {
          ...product1,
          count: product1.count + 1,
        },
      ],
      totalCost: product1.price * (product1.count + 1),
    });
  });
});
