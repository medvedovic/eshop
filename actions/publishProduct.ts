import { managementClient } from "../constants/clients";
import { BaseResponses } from "@kentico/kontent-management/_commonjs/responses";

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
