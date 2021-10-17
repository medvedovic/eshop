import { NextApiRequest, NextApiResponse } from "next";

import { deliveryClient } from "../../constants/clients";
import { Product as ProductKontentModel } from "../../models/product";
import { OrdersRepository } from "../../repositories/order";
import type { OrderServerModel } from "../../serverModels/Order";

// Todo: RENAME TO ORDER !!!

type ResponseData = Record<string, never>;

export const StatusCodes = {
  Ok: 200,
  SeeOther: 303,
  BadRequest: 400,
  NotFound: 404,
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isBodyValid = (obj: any): obj is OrderServerModel =>
  obj && obj.name && obj.email && obj.phone;

export default async (
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>
): Promise<void> => {
  if (request.method === "PUT") {
    // authorize
    const { id, ...rest } = JSON.parse(request.body);
    await OrdersRepository.update(id, rest);
    response.status(StatusCodes.Ok).end();
    return;
  }
  if (request.method === "POST") {
    const { body } = request;

    if (!isBodyValid(body)) {
      response.status(StatusCodes.BadRequest);
      response.end();
      return;
    }

    const codenames = body.products.map(({ codename }) => codename);
    const deliveryResponse = await deliveryClient
      .items<ProductKontentModel>()
      .inFilter("system.codename", codenames)
      .toPromise();
    const products = body.products.map(({ codename, count }) => {
      const item = deliveryResponse.items.find(
        (value) => value.system.codename === codename
      );
      return {
        count,
        name: item.name.value,
        price: item.price.value,
      };
    });

    await OrdersRepository.add({
      customer: {
        name: body.name,
        phone: body.phone,
        email: body.email,
      },
      address: {
        shipping: body.shipping,
        city: body.city,
        postalCode: body.postalCode,
      },
      products,
    });

    response.redirect(StatusCodes.SeeOther, "/cart/03");
    return;
  }

  response.status(StatusCodes.NotFound);
  response.end();
  return;
};
