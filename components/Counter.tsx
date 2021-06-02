import React from "react";
import styles from "./Counter.module.sass";

const countUpperBoundary = 99;
const countBottomBoundary = 0;

const isNaN = (num: unknown): num is number => Number.isNaN(num);

type CounterProps = {
  readonly count: number;
  readonly setCount: (count: number) => void;
};

export const Counter: React.FC<CounterProps> = (props) => {
  const [count, setCount] = React.useState(props.count);
  const increment = () =>
    setCount((prev) =>
      prev === countUpperBoundary ? countUpperBoundary : ++prev
    );
  const decrement = () => {
    setCount((prev) =>
      prev === countBottomBoundary ? countBottomBoundary : --prev
    );
  };
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      setCount(() => parsedValue);
    }
    if (!value) {
      setCount(0);
    }
  };

  React.useEffect(() => {
    props.setCount(count);
  }, [count]);

  return (
    <div className={styles.counter}>
      <input
        onChange={onChange}
        className={styles.counter__text}
        placeholder="0"
        size={2}
        value={count}
        pattern="[0-9]*"
        name="count"
      />
      <div className={styles.counter__controls}>
        <button
          disabled={count === countUpperBoundary}
          onClick={increment}
          className={styles.counter__control}
        >
          +
        </button>
        <button
          disabled={count === countBottomBoundary}
          onClick={decrement}
          className={styles.counter__control}
        >
          -
        </button>
      </div>
    </div>
  );
};
