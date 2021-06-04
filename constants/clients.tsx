import { DeliveryClient, TypeResolver } from "@kentico/kontent-delivery";
import { ManagementClient } from "@kentico/kontent-management";

import { Product } from "../models/product";

// script to generate models from Kontent
// kontent-generate --projectId=xyz --moduleResolution=ES2015 --codeType=TypeScript

export const deliveryClient = new DeliveryClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  typeResolvers: [new TypeResolver("product", () => new Product())],
});

export const managementClient = new ManagementClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_CM_API_KEY,
});
