import { managementClient } from "../constants/clients";
import { BaseResponses } from "@kentico/kontent-management/_commonjs/responses";

export const createNewVersion = async (
  itemCodename: string,
  languageCodename = "default"
): Promise<BaseResponses.EmptyContentManagementResponse> =>
  await managementClient
    .createNewVersionOfLanguageVariant()
    .byItemCodename(itemCodename)
    .byLanguageCodename(languageCodename)
    .toPromise();
