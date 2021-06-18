import { NavArrowDown, NavArrowUp } from "iconoir-react";
import React from "react";

import { InvoiceStatus } from "../constants/InvoiceStatus";
import { Spacing } from "../constants/ui";
import { InvoiceViewModel } from "../viewModels/InvoiceViewModel";
import { Stack } from "./Stack";

import styles from "./InvoicesListing.module.sass";
import { Inline } from "./Inline";

type Props = {
  readonly invoices: readonly InvoiceViewModel[];
};

const OrderStatusToSlovakMap: Record<InvoiceStatus, string> = {
  [InvoiceStatus.New]: "Nová",
  [InvoiceStatus.Archived]: "Archivovaná",
  [InvoiceStatus.InProgress]: "Spracúva sa",
};

type SectionProps = {
  readonly name: string;
  readonly obj: Record<string, unknown>;
};

const Section: React.FC<SectionProps> = ({ name, obj }) => (
  <section>
    <Stack spacing={Spacing.L}>
      <h2 className={styles.h2}>{name}</h2>
      <Stack spacing={Spacing.M}>
        {Object.values(obj).map((value, index) => (
          <React.Fragment key={index}>{value}</React.Fragment>
        ))}
      </Stack>
    </Stack>
  </section>
);

type InvoiceListingItemProps = {
  readonly invoice: InvoiceViewModel;
};

const InvoiceListingItem: React.FC<InvoiceListingItemProps> = ({ invoice }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const toggleIsCollapsed = () => setIsCollapsed((prevState) => !prevState);
  return (
    <article key={invoice.id}>
      <div className={styles["invoices__list-item"]}>
        <div>Id: {invoice.id}</div>
        <div>Stav: {OrderStatusToSlovakMap[invoice.status]}</div>
        <div>Zodpovedná osoba: {invoice.assignee || "Nepriradené"}</div>
        <div>
          <button
            className={styles["invoices__toggle"]}
            onClick={toggleIsCollapsed}
          >
            {isCollapsed ? (
              <NavArrowUp size={20} />
            ) : (
              <NavArrowDown size={20} />
            )}
          </button>
        </div>
      </div>
      {isCollapsed && (
        <div className={styles["invoices__details"]}>
          <div className={styles["invoices__details-col"]}>
            <Stack spacing={Spacing.M}>
              <Section name="Kontaktné údaje:" obj={invoice.customer} />
              <Section name="Adresa:" obj={invoice.address} />
            </Stack>
          </div>
          <div className={styles["invoices__details-col"]}>
            <Stack spacing={Spacing.L}>
              <h2 className={styles.h2}>Nákup:</h2>
              <Stack spacing={Spacing.M}>
                {invoice.products.map((product, index) => (
                  <div key={index} className={styles["invoices__product"]}>
                    <Inline spacing={Spacing.M}>
                      <>{product.count}x</>
                      <>{product.name}</>
                    </Inline>
                    <>{product.price}</>
                  </div>
                ))}
              </Stack>
            </Stack>
          </div>
        </div>
      )}
    </article>
  );
};

export const InvoicesListing: React.FC<Props> = ({ invoices }) => {
  return (
    <div className={styles.invoices}>
      {/*<Inline>Filter</Inline>  */}
      <div className="invoices__list">
        <Stack spacing={Spacing.M}>
          {invoices.map((invoice) => (
            <InvoiceListingItem invoice={invoice} key={invoice.id} />
          ))}
        </Stack>
      </div>
    </div>
  );
};
