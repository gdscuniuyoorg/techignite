/**
 * Safely read a text field from FormData. Files and missing keys both
 * yield an empty string instead of the "[object File]" foot-gun.
 */
export function formText(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === 'string' ? value : '';
}
