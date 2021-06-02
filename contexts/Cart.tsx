import React from "react";
import {
  Cart,
  cartRepository,
  initialCart,
  ProductCartModel,
} from "../repositories/cart";

type CartContext = {
  readonly get: () => Cart;
  readonly add: (product: ProductCartModel) => void;
  readonly addOne: (productId: string) => void;
  readonly clear: () => void;
  readonly remove: (product: ProductCartModel) => void;
  readonly update: (product: ProductCartModel) => void;
};

const noOperation = () => undefined;

const initial: CartContext = {
  get: noOperation,
  add: noOperation,
  addOne: noOperation,
  clear: noOperation,
  remove: noOperation,
  update: noOperation,
};

export const CartContext = React.createContext<CartContext>(initial);

export const CartContextProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<Cart>(initialCart);

  React.useEffect(() => {
    cartRepository.initialize();
    setState(cartRepository.get());
  }, []);

  return (
    <CartContext.Provider
      value={{
        get: () => state,
        add: (product) => setState(cartRepository.add(product)),
        addOne: (productId) => setState(cartRepository.addOne(productId)),
        update: (product) => setState(cartRepository.update(product)),
        remove: (product) => setState(cartRepository.remove(product)),
        clear: () => setState(cartRepository.clear()),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
