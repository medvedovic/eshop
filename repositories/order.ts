import mongoose from "mongoose";

import { InvoiceStatus } from "../constants/InvoiceStatus";
import { Order as OrderDbModel } from "../dbModels/Order";
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

type Invoice = Omit<InvoiceViewModel, 'assignee'> & {
  readonly assigneeId: string;
}

const toViewModel = (obj: OrderDbModel): Invoice => ({
  status: obj.status,
  id: obj._id.toString(),
  assigneeId: obj.assigneeId ?? null,
  address: {
    shipping: obj.address.shipping,
    city: obj.address.city,
    postalCode: obj.address.postalCode,
  },
  customer: {
    name: obj.customer.name,
    phone: obj.customer.phone,
    email: obj.customer.email,
  },
  products: obj.products.map((product) => ({
    name: product.name,
    price: product.price,
    count: product.count,
  })),
});

type OrdersRepository = {
  readonly add: (createModel: OrderCreateModel) => Promise<string>;
  readonly initialize: () => void;
  readonly getAll: () => Promise<readonly Invoice[]>;
};

const connectionString = process.env.MONGODB_CONNECTION_STRING;

export const OrdersRepository: OrdersRepository = {
  getAll: async () => {
    const result = await OrderDbModel.find({}).select(
      "customer address products assigneeId status"
    );
    return result.map(toViewModel) as unknown as readonly Invoice[];
  },
  add: async (createModel: OrderCreateModel) => {
    const a = new OrderDbModel({
      status: InvoiceStatus.New,
      assigneeId: undefined, // maybe omit
      ...createModel,
    });
    const response = await a.save();
    return response.id;
  },
  initialize: async () => {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  },
};

OrdersRepository.initialize();
