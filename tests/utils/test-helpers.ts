
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === undefined || current === null) {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current === undefined ? defaultValue : current;
}


export function typeCast<T>(obj: any): T {
  return obj as T;
}


export function expectProperty(obj: any, path: string, expected: any) {
  const value = safeGet(obj, path, undefined);
  expect(value).toEqual(expected);
}


export function expectHasProperty(obj: any, path: string) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    expect(current).toHaveProperty(part);
    current = current[part];
  }
  
  expect(current).toHaveProperty(parts[parts.length - 1]);
}


export function expectArrayLength(obj: any, path: string, length: number) {
  const arr = safeGet(obj, path, []);
  expect(Array.isArray(arr)).toBe(true);
  expect(arr.length).toBe(length);
} 