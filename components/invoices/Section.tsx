import React from "react";

import { Spacing } from "../../constants/ui";
import { Stack } from "../Stack";
import styles from "./Invoices.module.sass";

export const Section: React.FC<{
  readonly name: string;
  readonly obj: Record<string, unknown>;
}> = ({ name, obj }) => (
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
