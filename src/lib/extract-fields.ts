/**
 * Extracts specified fields from an object using dot notation paths
 * @param obj - The source object
 * @param fields - Array of property paths to extract (e.g., ['id', 'field_media_image.meta.alt'])
 * @returns Object containing only the specified fields, or the original object if no fields specified
 */
export function extractFields(obj: any, fields?: string[]): any {
  // If no fields specified, return the entire object
  if (!fields || fields.length === 0) {
    return obj;
  }

  const result: any = {};

  for (const field of fields) {
    const value = getNestedProperty(obj, field);
    if (value !== undefined) {
      setNestedProperty(result, field, value);
    }
  }

  return result;
}

/**
 * Gets a nested property from an object using dot notation
 * @param obj - The source object
 * @param path - The property path (e.g., 'field_media_image.meta.alt')
 * @returns The property value or undefined if not found
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Sets a nested property in an object using dot notation
 * @param obj - The target object
 * @param path - The property path (e.g., 'field_media_image.meta.alt')
 * @param value - The value to set
 */
function setNestedProperty(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;

  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);

  target[lastKey] = value;
}
