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
