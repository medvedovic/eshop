export type OrderServerModel = {
  readonly city: string;
  readonly consent: string;
  readonly email: string;
  readonly name: string;
  readonly phone: string;
  readonly postalCode: number;
  readonly shipping: string;
  readonly products: readonly {
    readonly codename: string;
    readonly count: number;
  }[];
};
