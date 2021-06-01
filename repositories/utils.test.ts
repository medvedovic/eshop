import {
  addExistingItemToCart,
  addNewItemToCart,
  removeProductFromCart,
} from "./utils";

describe("addNewItemToCart", () => {
  it("given an empty cart returns a cart with one item", () => {
    const initial = {
      productIdCount: new Map(),
      totalCost: 0,
    };
    const actual = addNewItemToCart(initial, {
      id: "001",
      count: 2,
      price: 20,
    });
    expect(actual).toEqual({
      productIdCount: new Map([["001", 2]]),
      totalCost: 40,
    });
  });
  it("given a non-empty cart, returns a cart with added item", () => {
    const initial = {
      productIdCount: new Map([["001", 2]]),
      totalCost: 40,
    };
    const actual = addNewItemToCart(initial, {
      id: "002",
      count: 1,
      price: 20,
    });
    expect(actual).toEqual({
      productIdCount: new Map([
        ["001", 2],
        ["002", 1],
      ]),
      totalCost: 60,
    });
  });
});

describe("addExistingItemToCart", () => {
  it("given a non-empty cart, updates item count", () => {
    const initial = {
      productIdCount: new Map([["001", 2]]),
      totalCost: 40,
    };
    const actual = addExistingItemToCart(initial, {
      id: "001",
      count: 3,
      price: 20,
    });
    expect(actual).toEqual({
      productIdCount: new Map([["001", 3]]),
      totalCost: 60,
    });
  });
});

describe("removeProductFromCart", () => {
  it("given a non-empty cart, removes and item", () => {
    const initial = {
      productIdCount: new Map([
        ["001", 2],
        ["002", 1],
      ]),
      totalCost: 60,
    };
    const actual = removeProductFromCart(initial, {
      id: "001",
      count: 2,
      price: 20,
    });
    expect(actual).toEqual({
      productIdCount: new Map([["002", 1]]),
      totalCost: 20,
    });
  });
  it("given a non-empty cart, returns an empty cart", () => {
    const initial = {
      productIdCount: new Map([
        ["001", 2],
      ]),
      totalCost: 60,
    };
    const actual = removeProductFromCart(initial, {
      id: "001",
      count: 2,
      price: 20,
    });
    expect(actual).toEqual({
      productIdCount: new Map([["002", 1]]),
      totalCost: 20,
    });
  });
});
