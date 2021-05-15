import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

export default (): NextPage => {
  const router = useRouter();

  React.useEffect(() => {
    router.push("api/auth/signin/auth0");
  });

  return null;
};
