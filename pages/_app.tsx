import { Provider } from "next-auth/client";
import "../styles/globals.sass";
import "../styles/main.sass";
import React from "react";
import { AppProps } from "next/app";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Provider session={pageProps.session}>
    <Component {...pageProps} />
  </Provider>
);

export default MyApp;
