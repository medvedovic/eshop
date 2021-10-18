import { NavArrowDown, NavArrowUp } from "iconoir-react";
import React from "react";

import { InvoiceStatus } from "../../constants/InvoiceStatus";
import { Spacing } from "../../constants/ui";
import { AdminViewModel } from "../../viewModels/AdminViewModel";
import { InvoiceViewModel } from "../../viewModels/InvoiceViewModel";
import { IconButton } from "../Button";
import { Inline } from "../Inline";
import { Stack } from "../Stack";
import styles from "./Invoices.module.sass";
import { Section } from "./Section";
import { Selectable } from "./Selectable";

const OrderStatusToSlovakMap: Record<InvoiceStatus, string> = {
  [InvoiceStatus.New]: "Nová",
  [InvoiceStatus.Archived]: "Archivovaná",
  [InvoiceStatus.InProgress]: "Spracúva sa",
};

const invoiceStatusesOptions = Object.entries(OrderStatusToSlovakMap).map(
  ([key, value]) => ({
    id: key,
    name: value,
  })
);

export const InvoiceListingItem: React.FC<{
  readonly invoice: InvoiceViewModel;
  readonly assignees: readonly AdminViewModel[];
}> = ({ invoice, assignees }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleIsExpanded = () => setIsExpanded((prevState) => !prevState);

  const [selectedStatus, setSelectedStatus] = React.useState<InvoiceStatus>(
    invoice.status
  );
  const resetSelectedStatus = () => setSelectedStatus(invoice.status);

  const [selectedAssignee, setSelectedAssignee] = React.useState(
    invoice.assignee?.userId
  );
  const resetSelectedAssignee = () =>
    setSelectedAssignee(invoice.assignee?.userId);

  const shouldAllowSubmit =
    selectedStatus !== invoice.status ||
    selectedAssignee !== invoice.assignee?.userId;

  const resetChanges = () => {
    resetSelectedAssignee();
    resetSelectedStatus();
    setIsExpanded(false);
  };

  const put = async () => {
    await fetch("/api/invoice", {
      method: "PUT",
      body: JSON.stringify({
        id: invoice.id,
        assigneeId: selectedAssignee,
        status: selectedStatus,
      }),
    });
    window.location.reload();
  };

  return (
    <article key={invoice.id}>
      <div className={styles["invoices__list-item"]}>
        <div>Id: {invoice.id}</div>
        <Selectable
          name="Stav"
          value={OrderStatusToSlovakMap[invoice.status]}
          options={invoiceStatusesOptions}
          readonly={!isExpanded}
          selected={selectedStatus}
          onChange={(event) =>
            setSelectedStatus(event.target.value as InvoiceStatus)
          }
          onCancel={resetSelectedStatus}
        />
        <Selectable
          name="Zodpovedná osoba"
          value={invoice.assignee?.name || "Nepriradené"}
          options={assignees.map(({ name, userId }) => ({
            name,
            id: userId,
          }))}
          readonly={!isExpanded}
          selected={selectedAssignee}
          onChange={(event) => {
            setSelectedAssignee(event.target.value);
          }}
          onCancel={resetSelectedAssignee}
        />
        <div>
          <IconButton onClick={toggleIsExpanded}>
            {isExpanded ? <NavArrowUp size={20} /> : <NavArrowDown size={20} />}
          </IconButton>
        </div>
      </div>
      {isExpanded && (
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
          <div className={styles["invoices__details-row"]}>
            <Inline spacing={Spacing.M}>
              <button
                onClick={resetChanges}
                className={styles["invoices__cancel"]}
              >
                Zrušiť
              </button>
              <button
                disabled={!shouldAllowSubmit}
                className={styles["invoices__submit"]}
                onClick={put}
              >
                Potvrdiť
              </button>
            </Inline>
          </div>
        </div>
      )}
    </article>
  );
};
