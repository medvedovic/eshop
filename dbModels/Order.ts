import mongoose from "mongoose";

export enum OrderStatus {
  New = "new",
  InProgress = "in-progress",
  Archived = "archived",
}

export type Order = {
  readonly status: OrderStatus;
  readonly assigneeId: string;
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

const schema = new mongoose.Schema<Order>({
  status: String,
  assigneeId: String, // Todo: verify type
  customer: {
    name: String,
    phone: String,
    email: String,
  },
  address: {
    shipping: String,
    city: String,
    postalCode: String,
  },
  products: [
    {
      name: String,
      price: Number,
      count: Number,
    },
  ],
});

export const Order =
  mongoose.models.Order || mongoose.model<Order>("Order", schema);
