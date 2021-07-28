export type Valueof<T> = T[keyof T]

/**
 * Determine if a value is defined
 */
export const isDefined = <T>(arg: T | undefined): arg is T =>
  typeof arg !== 'undefined'

/**
 * Spread a truthy value or an explicitly inserted value into an array
 *
 * @usage
 * [...concatTruthy(false, 'ignore me')].length === [].length
 * [...concatTruthy(true)].length !== [].length
 */
export const concatTruthy = <T>(val: T | unknown, insert?: T) =>
  val ? [insert || val] : []

/**
 * Returns value if exists in object
 */
export const objValue = <T extends Record<string, unknown>>(
  value: unknown,
  obj: T
): Valueof<T> | undefined => {
  if (Object.values(obj).includes(value)) {
    return value as T[keyof T]
  }
}

/**
 * Parse value that may be undefined - good for `target.dataset.value`
 */
export const parseNum = (str: string | undefined) =>
  str ? parseInt(str, 10) : undefined

export const findDuplicates = (arr: unknown[]) => {
  const sorted = arr.slice().sort()
  const duplicates = []
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] === sorted[i]) {
      duplicates.push(sorted[i])
    }
  }
  return duplicates
}
