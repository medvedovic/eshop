export const groupByMultiple = <T extends unknown>(
  array: readonly T[],
  getter: (element: T) => readonly string[]
): readonly [string, readonly T[]][] => {
  const temp = array.reduce<Map<string, readonly T[]>>(
    (accumulator, current) => {
      const keys = getter(current);
      let temp;
      keys.forEach((key) => {
        temp = accumulator.has(key)
          ? accumulator.set(key, [...accumulator.get(key), current])
          : accumulator.set(key, [current]);
      });
      return temp;
    },
    new Map<string, readonly T[]>()
  );

  return Array.from(temp.entries());
};
