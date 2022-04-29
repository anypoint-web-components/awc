/**
 * Used to convert an attribute to a float number.
 * @param input The input from the attribute.
 */
export function floatConverter(input: unknown): number | undefined {
  if (input === null || input === undefined) {
    return undefined;
  }
  return parseFloat(input as string);
}

/**
 * Converts a number to a string
 * @param input The input from the attribute or a property.
 */
export function stringAndNumberConverter(input: unknown): string | undefined {
  if (input === null || input === undefined) {
    return undefined;
  }
  if (typeof input === 'number') {
    return String(input);
  }
  return String(input);
}
