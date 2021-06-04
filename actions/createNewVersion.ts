import { BaseResponses } from "@kentico/kontent-management/_commonjs/responses";

import { managementClient } from "../constants/clients";

export const createNewVersion = async (
  itemCodename: string,
  languageCodename = "default"
): Promise<BaseResponses.EmptyContentManagementResponse> =>
  await managementClient
    .createNewVersionOfLanguageVariant()
    .byItemCodename(itemCodename)
    .byLanguageCodename(languageCodename)
    .toPromise();
