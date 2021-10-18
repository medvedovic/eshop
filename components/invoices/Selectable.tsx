import classNames from "classnames";
import { Cancel, EditPencil } from "iconoir-react";
import React from "react";

import { IconButton } from "../Button";
import styles from "./Selectable.module.sass";

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

export const Selectable: React.FC<SelectableProps> = ({
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
