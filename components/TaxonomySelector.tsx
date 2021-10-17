import classNames from "classnames";
import React from "react";

import { Spacing } from "../constants/ui";
import { Stack } from "./Stack";
import styles from "./TaxonomySelector.module.sass";

type TaxonomySelectorProps<T extends Readonly<Record<string, unknown>>> = {
  readonly options: readonly T[];
  readonly initialSelectedOptions?: readonly string[];
  readonly getOptionName: (option: T) => string;
  readonly getOptionCodename: (option: T) => string;
  readonly title?: string;
  readonly onChange?: (options: readonly string[]) => void;
};

const getNewState = (state: ReadonlySet<string>, codename) =>
  state.has(codename)
    ? new Set([...Array.from(state.values())].filter((el) => el !== codename))
    : new Set([...Array.from(state.values()), codename]);

export function getTaxonomySelector<
  T extends Readonly<Record<string, unknown>>
>(): React.ComponentType<TaxonomySelectorProps<T>> {
  const TaxonomySelector: React.FC<TaxonomySelectorProps<T>> = ({
    getOptionCodename,
    getOptionName,
    initialSelectedOptions,
    onChange,
    options,
    title,
  }) => {
    const [state, setState] = React.useState<ReadonlySet<string>>(
      new Set<string>(initialSelectedOptions ?? [])
    );

    return (
      <div>
        {title && (
          <h3 className={classNames("h3", styles["taxonomy-selector__title"])}>
            {title}
          </h3>
        )}
        <Stack spacing={Spacing.M}>
          {options.map((option) => {
            const codename = getOptionCodename(option);

            return (
              <label
                key={codename}
                className={styles["taxonomy-selector__label"]}
              >
                <input
                  checked={state.has(codename)}
                  className={styles["taxonomy-selector__check-box"]}
                  type="checkbox"
                  value={codename}
                  onChange={() => {
                    const newState = getNewState(state, codename);
                    onChange(Array.from(newState.values()));
                    setState(newState);
                  }}
                />
                {getOptionName(option)}
              </label>
            );
          })}
        </Stack>
      </div>
    );
  };

  TaxonomySelector.displayName = "TaxonomySelector";

  return TaxonomySelector;
}
