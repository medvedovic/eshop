import "../styles/globals.sass";
import "../styles/main.sass";

import { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import React from "react";

import { CartContextProvider } from "../contexts/Cart";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Provider session={pageProps.session}>
    <CartContextProvider>
      <Component {...pageProps} />
    </CartContextProvider>
  </Provider>
);

export default MyApp;
