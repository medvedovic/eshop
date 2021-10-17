import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { getSession, useSession } from "next-auth/client";
import React from "react";

import { InvoicesListing } from "../components/InvoicesListing";
import { Navigation } from "../components/Navigation";
import { OrdersRepository } from "../repositories/order";
import type { AdminViewModel } from "../viewModels/AdminViewModel";
import type { InvoiceViewModel } from "../viewModels/InvoiceViewModel";

type InvoicesProps = {
  readonly availableAssignees: readonly AdminViewModel[];
  readonly invoices: readonly InvoiceViewModel[];
};

const Invoices: NextPage<InvoicesProps> = ({
  availableAssignees,
  invoices,
}) => {
  const [session] = useSession();

  return (
    <>
      <Head>
        <title>pb175 eshop</title>
      </Head>
      <Navigation isAdmin={!!session} />
      <div className="container">
        <main className="main">
          <h1 className="h1">Objednávky</h1>
          <InvoicesListing invoices={invoices} assignees={availableAssignees} />
        </main>
      </div>
    </>
  );
};

export default Invoices;

const bearerToken = `Bearer ${process.env.AUTH0_MANAGEMENT_TOKEN}`;

const getManagementToken = async () => {
  const response = await fetch(
    "https://medvedovic-test.eu.auth0.com/oauth/token",
    {
      method: "POST",
      headers: new Headers([
        ["content-type", "application/x-www-form-urlencoded"],
      ]),
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: "https://medvedovic-test.eu.auth0.com/api/v2/",
      }),
    }
  );

  return await response.json();
};

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/c5ce23403bff80777481a0d232d18490e3c0e81d/types/auth0-js/index.d.ts#L779
export type Auth0UserProfile = {
  readonly name: string;
  readonly nickname: string;
  readonly picture: string;
  readonly user_id: string;
  readonly username?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly email?: string;
  readonly email_verified?: boolean;
  readonly clientID: string;
  readonly gender?: string;
  readonly locale?: string;
  readonly identities: {
    readonly connection: string;
    readonly isSocial: boolean;
    readonly provider: string;
    readonly user_id: string;
  }[];
  readonly created_at: string;
  readonly updated_at: string;
  readonly sub: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly user_metadata?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly app_metadata?: any;
};

const toAdminViewModel = ({
  name,
  user_id,
}: Auth0UserProfile): AdminViewModel => ({
  name,
  userId: user_id,
});

const getAdmins = async (): Promise<readonly Auth0UserProfile[]> => {
  const token = process.env.AUTH0_MANAGEMENT_TOKEN
    ? bearerToken
    : await getManagementToken();

  const response = await fetch(
    "https://medvedovic-test.eu.auth0.com/api/v2/users",
    {
      method: "GET",
      headers: new Headers([["Authorization", token]]),
    }
  );

  return await response.json();
};

export const getServerSideProps: GetServerSideProps<InvoicesProps> = async (
  context
) => {
  const session = await getSession(context);
  const invoicesDb = await OrdersRepository.getAll();
  const admins = await getAdmins();
  const assignees = admins.map(toAdminViewModel);
  const invoices = invoicesDb.map(({ assigneeId, ...rest }) => ({
    ...rest,
    assignee: assigneeId
      ? assignees.find((a) => a.userId === assigneeId)
      : null,
  }));

  if (!session) {
    return {
      redirect: {
        statusCode: 301,
        destination: "/",
      },
    };
  }

  return {
    props: {
      availableAssignees: assignees,
      invoices,
    },
  };
};
