import Head from "next/head";
import { getSession, useSession } from "next-auth/client";
import React from "react";

import { Navigation } from "../components/Navigation";
import { GetServerSideProps, NextPage } from "next";
import type { InvoiceViewModel } from "../viewModels/InvoiceViewModel";
import { InvoicesListing } from "../components/InvoicesListing";

const cachedInvoices =
  '[{"status":"new","id":"60c3ad4188dfed25d5c28ae1","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c3b70b65e5a9284195224a","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5af8c23dc6b526842dab0","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b063b3191352d122495f","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b21329a83a53c1fcf96f","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b21b29a83a53c1fcf972","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b22829a83a53c1fcf975","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b28c29a83a53c1fcf978","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b34629a83a53c1fcf97b","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b35829a83a53c1fcf97e","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b37b29a83a53c1fcf981","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b39e29a83a53c1fcf984","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b3b829a83a53c1fcf987","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c5b40329a83a53c1fcf98a","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c8de92d91da006605f65f1","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Patrik Em","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]},{"status":"new","id":"60c8deba3377db06f7e73684","assigneeId":null,"address":{"shipping":"Asdf","city":"Brno","postalCode":"12345"},"customer":{"name":"Asdf","phone":"12345678","email":"12345678"},"products":[{"name":"Bryndza 100g","price":49.9,"count":5},{"name":"Morca della","price":25,"count":2}]}]';

// todo: clear cart after submission

const log = (name: string, object: any): void => {
  console.log(`${name}: ${object}`);
};

type InvoicesProps = {
  readonly availableAssignees: readonly AdminViewModel[];
  readonly invoices: readonly InvoiceViewModel[];
};

const Invoices: NextPage<InvoicesProps> = ({
  availableAssignees,
  invoices,
}) => {
  const [session] = useSession();
  log("Session", session?.user);

  return (
    <>
      <Head>
        <title>pb175 eshop</title>
      </Head>
      <Navigation isAdmin={!!session} />
      <div className="container">
        <main className="main">
          <h1 className="h1">Objednávky</h1>
          {availableAssignees.map((a) => a.name).join(", ")}
          <InvoicesListing invoices={invoices} />
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
  readonly user_metadata?: any;
  readonly app_metadata?: any;
};

type AdminViewModel = {
  readonly name: string;
  readonly userId: string;
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
  // const invoicesDb = await OrdersRepository.getAll();
  const invoicesDb = JSON.parse(cachedInvoices);
  const admins = await getAdmins();
  const assignees = admins.map(toAdminViewModel);
  const invoices = invoicesDb.map(({ assigneeId, ...rest }) => ({
    ...rest,
    assignee: assignees.find((a) => a.userId === assigneeId)?.name ?? "",
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