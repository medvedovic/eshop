import faunadb, { query as q, values } from "faunadb";

import { InvoiceStatus } from "../constants/InvoiceStatus";
import { Order } from "../dbModels/Order";
import type { InvoiceViewModel } from "../viewModels/InvoiceViewModel";

type OrderCreateModel = {
  readonly customer: {
    readonly name: string;
    readonly phone: string;
    readonly email: string;
  };
  readonly address: {
    readonly shipping: string;
    readonly city: string;
    readonly postalCode: number;
  };
  readonly products: readonly {
    readonly name: string;
    readonly price: number;
    readonly count: number;
  }[];
};

type OrderUpdateModel = {
  readonly status?: InvoiceStatus;
  readonly assigneeId?: string;
};

// https://stackoverflow.com/a/48244432
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

type NonEmptyOrderUpdateModel = AtLeastOne<OrderUpdateModel>;

type Invoice = Omit<InvoiceViewModel, "assignee"> & {
  readonly assigneeId: string;
};

const toViewModel = ({ data, ref }: values.Document<Order>): Invoice => ({
  status: data.status,
  id: ref.id,
  assigneeId: data.assigneeId ?? null,
  address: {
    shipping: data.address.shipping,
    city: data.address.city,
    postalCode: data.address.postalCode,
  },
  customer: {
    name: data.customer.name,
    phone: data.customer.phone,
    email: data.customer.email,
  },
  products: data.products.map((product) => ({
    name: product.name,
    price: product.price,
    count: product.count,
  })),
});

type OrdersRepository = {
  readonly add: (createModel: OrderCreateModel) => Promise<Invoice>;
  readonly getAll: () => Promise<readonly Invoice[]>;
  readonly update: (
    id: string,
    update: NonEmptyOrderUpdateModel
  ) => Promise<Invoice>;
};

const secret = process.env.FAUNADB_SECRET;
const collectionName = "Orders";
const client: faunadb.Client = new faunadb.Client({
  secret,
  domain: "db.eu.fauna.com",
});

type Response = {
  readonly data: readonly values.Document<Order>[];
};

export const OrdersRepository: OrdersRepository = {
  getAll: async () => {
    const response = await client.query<Response>(
      q.Map(
        q.Paginate(q.Documents(q.Collection(collectionName))),
        q.Lambda((x) => q.Get(x))
      )
    );
    return response.data.map(toViewModel);
  },
  add: async (createModel: OrderCreateModel) => {
    const response = await client.query<values.Document<Order>>(
      q.Create(q.Collection(collectionName), {
        data: { ...createModel, status: InvoiceStatus.New },
      })
    );
    return toViewModel(response);
  },
  update: async (id, update) => {
    const response = await client.query<values.Document<Order>>(
      q.Update(q.Ref(q.Collection(collectionName), id), {
        data: { ...update },
      })
    );

    return toViewModel(response);
  },
};
