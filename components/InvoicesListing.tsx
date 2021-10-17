import classNames from "classnames";
import { Cancel, EditPencil, NavArrowDown, NavArrowUp } from "iconoir-react";
import { useSession } from "next-auth/client";
import React from "react";

import { InvoiceStatus } from "../constants/InvoiceStatus";
import { Spacing } from "../constants/ui";
import type { AdminViewModel } from "../viewModels/AdminViewModel";
import { InvoiceViewModel } from "../viewModels/InvoiceViewModel";
import { Inline } from "./Inline";
import styles from "./InvoicesListing.module.sass";
import { Stack } from "./Stack";

type Props = {
  readonly invoices: readonly InvoiceViewModel[];
  readonly assignees: readonly AdminViewModel[];
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
  readonly assignees: readonly AdminViewModel[];
};

type SelectableProps = {
  readonly name: string;
  readonly value: string;
  readonly options: readonly {
    readonly id: string | number;
    readonly name: string;
  }[];
  readonly readonly?: boolean;
  readonly selected: string | number;
  readonly onChange: React.ChangeEventHandler<HTMLSelectElement>;
  readonly onCancel: React.MouseEventHandler<HTMLButtonElement>;
};

type IconButtonProps = {
  readonly onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const IconButton: React.FC<IconButtonProps> = ({ onClick, children }) => (
  <button className={styles["icon-button"]} onClick={onClick}>
    {children}
  </button>
);

const Selectable: React.FC<SelectableProps> = ({
  name,
  value,
  options,
  readonly,
  selected,
  onChange,
  onCancel,
}) => {
  const [isBeingEdited, setIsBeingEdited] = React.useState(false);
  const ref = React.useRef<HTMLSelectElement>(null);
  const toggle = () =>
    readonly ? undefined : setIsBeingEdited((prevState) => !prevState);

  // force onchange in select on first render
  React.useEffect(() => {
    if (isBeingEdited) {
      ref?.current?.dispatchEvent(
        new Event("change", {
          bubbles: true,
        })
      );
    }
  }, [isBeingEdited]);

  return (
    <div
      className={classNames(styles.selectable, {
        [styles["selectable--readonly"]]: readonly,
      })}
    >
      {isBeingEdited && !readonly ? (
        <>
          <select onChange={onChange} value={selected} ref={ref}>
            {options.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <div className={styles["selectable__toggle"]}>
            <IconButton
              onClick={(e) => {
                toggle();
                onCancel(e);
              }}
            >
              <Cancel size={18} />
            </IconButton>
          </div>
        </>
      ) : (
        <>
          {name}: {value}
          <div className={styles["selectable__toggle"]}>
            <IconButton onClick={toggle}>
              <EditPencil size={18} />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};

const invoiceStatusesOptions = Object.entries(OrderStatusToSlovakMap).map(
  ([key, value]) => ({
    id: key,
    name: value,
  })
);

const InvoiceListingItem: React.FC<InvoiceListingItemProps> = ({
  invoice,
  assignees,
}) => {
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

type Filter = {
  readonly id: string;
  readonly by: (invoice: InvoiceViewModel) => boolean;
};

export const InvoicesListing: React.FC<Props> = ({ invoices, assignees }) => {
  const [session] = useSession();
  console.log(session?.user);
  const filters: readonly Filter[] = [
    {
      by: () => true,
      id: "all",
    },
    {
      by: (invoice) => invoice.assignee?.name === session.user.email,
      id: "mine",
    },
    {
      by: invoice => invoice.status === InvoiceStatus.New,
      id: 'unassigned'
    },
    {
      by: invoice => invoice.status === InvoiceStatus.InProgress,
      id: 'in-progress'
    },
    {
      by: invoice => invoice.status === InvoiceStatus.Archived,
      id: 'archived'
    }
  ];
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  return (
    <div className={styles.invoices}>
      <Stack spacing={Spacing.XL}>
        <Inline spacing={Spacing.XL}>
          <Inline spacing={Spacing.L}>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setSelectedFilter("all");
              }}
            >
              Všetky
            </a>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setSelectedFilter("mine");
              }}
            >
              Moje
            </a>
          </Inline>
          <Inline spacing={Spacing.L}>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setSelectedFilter("unassigned");
              }}
            >
              Nepriradené
            </a>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setSelectedFilter("in-progress");
              }}
            >
              Spracúva sa
            </a>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setSelectedFilter("archived");
              }}
            >
              Archivované
            </a>
          </Inline>
        </Inline>
        <div className="invoices__list">
          <Stack spacing={Spacing.M}>
            {invoices
              .filter(filters.find((f) => f.id === selectedFilter).by)
              .map((invoice) => (
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
