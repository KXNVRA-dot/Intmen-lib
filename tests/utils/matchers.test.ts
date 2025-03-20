import { expectProperty, expectHasProperty, expectArrayLength, safeGet, typeCast } from '../utils/test-helpers';

describe('Test helpers and matchers', () => {
  const testObject = {
    name: 'Test Object',
    count: 42,
    active: true,
    nested: {
      level1: {
        level2: 'nested value'
      },
      items: ['item1', 'item2', 'item3']
    },
    nullProp: null
  };

  describe('safeGet', () => {
    it('should retrieve nested property values', () => {
      expect(safeGet(testObject, 'name', '')).toBe('Test Object');
      expect(safeGet(testObject, 'count', 0)).toBe(42);
      expect(safeGet(testObject, 'nested.level1.level2', '')).toBe('nested value');
    });

    it('should return default value for missing properties', () => {
      expect(safeGet(testObject, 'missing', 'default')).toBe('default');
      expect(safeGet(testObject, 'nested.missing', 'default')).toBe('default');
      expect(safeGet(testObject, 'nested.level1.missing', 'default')).toBe('default');
    });

    it('should return default value for null or undefined objects', () => {
      expect(safeGet(null, 'any', 'default')).toBe('default');
      expect(safeGet(undefined, 'any', 'default')).toBe('default');
      expect(safeGet(testObject, 'nullProp.any', 'default')).toBe('default');
    });
  });

  describe('typeCast', () => {
    it('should cast objects to specific types', () => {
      const castObject = typeCast<{ name: string }>(testObject);
      expect(castObject.name).toBe('Test Object');
    });
  });

  describe('expectProperty', () => {
    it('should correctly verify property values', () => {
      expectProperty(testObject, 'name', 'Test Object');
      expectProperty(testObject, 'count', 42);
      expectProperty(testObject, 'nested.level1.level2', 'nested value');
    });

    it('should fail if property values do not match', () => {
      expect(() => expectProperty(testObject, 'name', 'Wrong Name')).toThrow();
    });
  });

  describe('expectHasProperty', () => {
    it('should verify property existence', () => {
      expectHasProperty(testObject, 'name');
      expectHasProperty(testObject, 'nested.level1');
      expectHasProperty(testObject, 'nested.items');
    });

    it('should fail if property does not exist', () => {
      expect(() => expectHasProperty(testObject, 'missing')).toThrow();
      expect(() => expectHasProperty(testObject, 'nested.missing')).toThrow();
    });
  });

  describe('expectArrayLength', () => {
    it('should verify array length', () => {
      expectArrayLength(testObject, 'nested.items', 3);
    });

    it('should fail if array length does not match', () => {
      expect(() => expectArrayLength(testObject, 'nested.items', 2)).toThrow();
    });

    it('should fail if property is not an array', () => {
      expect(() => expectArrayLength(testObject, 'name', 1)).toThrow();
    });
  });
});
