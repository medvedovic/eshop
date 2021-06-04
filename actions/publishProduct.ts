import { BaseResponses } from "@kentico/kontent-management/_commonjs/responses";

import { managementClient } from "../constants/clients";

export const publishProduct = async (
  itemCodename: string,
  languageCodename = "default"
): Promise<BaseResponses.EmptyContentManagementResponse> =>
  await managementClient
    .publishLanguageVariant()
    .byItemCodename(itemCodename)
    .byLanguageCodename(languageCodename)
    .withoutData()
    .toPromise();
