import { DeliveryClient, TypeResolver } from "@kentico/kontent-delivery";
import { Product } from "../models/product";

// script to generate models from Kontent
// kontent-generate --projectId=df06b413-2166-007e-1a51-13f85e5d4c9b --moduleResolution=ES2015 --codeType=TypeScript

export const client = new DeliveryClient({
  projectId: "df06b413-2166-007e-1a51-13f85e5d4c9b",
  typeResolvers: [new TypeResolver("product", () => new Product())],
});
