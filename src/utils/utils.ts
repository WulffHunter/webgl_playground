export function toRadian(num: number) {
  return (num * Math.PI) / 180
}

export function isPowerOf2(num: number) {
  return (num & (num - 1)) === 0
}

export function toRotation(num: number) {
  const mod = num % 360

  return mod
}

/**
 * Transforms an object into a new object
 * on a key-value pair basis
 * @param o The original object
 * @param f The mapping function
 * (takes a key and a value and returns a new key and value)
 * @returns The new object
 */
export function mapObject<
  O extends { [k in string]: any },
  KeyOut extends string,
  ValueOut,
>(
  o: O,
  f: (key: keyof O, value: O[keyof O]) => [KeyOut, ValueOut],
): { [K in KeyOut]: ValueOut } {
  return Object.fromEntries(
    Object.keys(o).map(key => f(key as keyof O, o[key]))
  ) as { [K in KeyOut]: ValueOut }
}