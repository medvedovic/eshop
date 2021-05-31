export type ProductEditViewModel = {
  readonly name: string;
  readonly photoUrl: string;
  readonly price: number;
  readonly description: string;
  readonly taxonomies: readonly string[];
};
