import mongoose, { Document } from "mongoose";

import { InvoiceStatus } from "../constants/InvoiceStatus";

export type Order = Document & {
  readonly status: InvoiceStatus;
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
