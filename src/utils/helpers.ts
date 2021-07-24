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
): T[keyof T] | undefined => {
  if (Object.values(obj).includes(value)) {
    return value as T[keyof T]
  }
}

export type Valueof<T> = T[keyof T]
