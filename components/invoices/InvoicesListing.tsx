import { useSession } from "next-auth/client";
import React from "react";

import { InvoiceStatus } from "../../constants/InvoiceStatus";
import { Spacing } from "../../constants/ui";
import type { AdminViewModel } from "../../viewModels/AdminViewModel";
import { InvoiceViewModel } from "../../viewModels/InvoiceViewModel";
import { Inline } from "../Inline";
import { LinkLike } from "../LinkLike";
import { Stack } from "../Stack";
import { InvoiceListingItem } from "./InvoiceListingItem";
import styles from "./Invoices.module.sass";

enum Filter {
  All = "all",
  Archived = "archived",
  InProgress = "in-progress",
  Mine = "mine",
  Unassigned = "unassigned",
}

export const InvoicesListing: React.FC<{
  readonly invoices: readonly InvoiceViewModel[];
  readonly assignees: readonly AdminViewModel[];
}> = ({ invoices, assignees }) => {
  const [session] = useSession();
  const filters: Record<Filter, (invoice: InvoiceViewModel) => boolean> = {
    [Filter.All]: () => true,
    [Filter.Archived]: (invoice) => invoice.status === InvoiceStatus.Archived,
    [Filter.InProgress]: (invoice) =>
      invoice.status === InvoiceStatus.InProgress,
    [Filter.Mine]: (invoice) => invoice.assignee?.name === session.user.email,
    [Filter.Unassigned]: (invoice) => invoice.status === InvoiceStatus.New,
  };
  const [selectedFilter, setSelectedFilter] = React.useState(Filter.All);
  return (
    <div className={styles.invoices}>
      <Stack spacing={Spacing.XL}>
        <Inline spacing={Spacing.XL}>
          <Inline spacing={Spacing.L}>
            <LinkLike onClick={() => setSelectedFilter(Filter.All)}>
              Všetky
            </LinkLike>
            <LinkLike onClick={() => setSelectedFilter(Filter.Mine)}>
              Moje
            </LinkLike>
          </Inline>
          <Inline spacing={Spacing.L}>
            <LinkLike onClick={() => setSelectedFilter(Filter.Unassigned)}>
              Nepriradené
            </LinkLike>
            <LinkLike onClick={() => setSelectedFilter(Filter.InProgress)}>
              Spracúva sa
            </LinkLike>
            <LinkLike onClick={() => setSelectedFilter(Filter.Archived)}>
              Archivované
            </LinkLike>
          </Inline>
        </Inline>
        <div className="invoices__list">
          <Stack spacing={Spacing.M}>
            {invoices.filter(filters[selectedFilter]).map((invoice) => (
              <InvoiceListingItem
                invoice={invoice}
                key={invoice.id}
                assignees={assignees}
              />
            ))}
          </Stack>
        </div>
      </Stack>
    </div>
  );
};
