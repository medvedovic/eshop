import mongoose from "mongoose";

import { Order as OrderDbModel, OrderStatus } from "../dbModels/Order";

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

type OrdersRepository = {
  readonly add: (createModel: OrderCreateModel) => Promise<string>;
  readonly initialize: () => void;
};

const connectionString = process.env.MONGODB_CONNECTION_STRING;

export const OrdersRepository: OrdersRepository = {
  add: async (createModel: OrderCreateModel) => {
    const a = new OrderDbModel({
      status: OrderStatus.New,
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
