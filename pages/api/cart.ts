import type { NextApiRequest, NextApiResponse } from "next";

import { deliveryClient } from "../../constants/clients";
import { Product as ProductKontentModel } from "../../models/product";
import type { ProductServerModel } from "../../serverModels/Product";

type ResponseData = {
  readonly items: readonly ProductServerModel[];
};

type T = {
  readonly codenames: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCartProductModel = (body: any): body is T => body && body.codenames;

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>
): Promise<void> => {
  if (request.method === "POST") {
    const { body } = request;
    if (!isCartProductModel(body)) {
      response.status(500);
      response.end();
      return;
    }
    if (!body.codenames.length) {
      response.status(200).json({ items: [] });
      response.end();
      return;
    }
    const deliveryResponse = await deliveryClient
      .items<ProductKontentModel>()
      .inFilter("system.codename", body.codenames)
      .toPromise();

    const items = deliveryResponse.items.map<ProductServerModel>((data) => ({
      codename: data.system.codename,
      description: data.description.value,
      name: data.name.value,
      photoUrl: data.photo.value[0].url,
      price: data.price.value,
    }));

    response.status(200).json({ items });
    response.end();
    return;
  }

  response.status(404);
  response.end();
  return;
};
