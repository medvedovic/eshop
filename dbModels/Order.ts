import { InvoiceStatus } from "../constants/InvoiceStatus";

export type Order = {
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
