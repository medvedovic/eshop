import { managementClient } from "../constants/clients";
import { LanguageVariantResponses } from "@kentico/kontent-management";

type Params = {
  readonly productName: string;
  readonly productPrice: number;
  readonly productDescription: string;
  readonly productTaxonomies: readonly string[];
};

const codenameToReferenceObject = (codename: string) => ({
  codename,
});

export const updateProduct = async (
  itemCodename: string,
  params: Params,
  languageCodename = "default"
): Promise<LanguageVariantResponses.UpsertLanguageVariantResponse> =>
  await managementClient
    .upsertLanguageVariant()
    .byItemCodename(itemCodename)
    .byLanguageCodename(languageCodename)
    .withData((builder) => [
      builder.textElement({
        element: {
          codename: "name",
        },
        value: params.productName,
      }),
      builder.numberElement({
        element: {
          codename: "price",
        },
        value: params.productPrice,
      }),
      builder.textElement({
        element: {
          codename: "description",
        },
        value: params.productDescription,
      }),
      builder.taxonomyElement({
        element: {
          codename: "product_categories",
        },
        value: params.productTaxonomies.map(codenameToReferenceObject),
      }),
    ])
    .toPromise();
