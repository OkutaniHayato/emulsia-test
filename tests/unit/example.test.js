/**
 * Unit Test Example
 * Tests individual functions and modules in isolation
 */

describe('Math Operations', () => {
  test('addition should work correctly', () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  test('subtraction should work correctly', () => {
    const result = 5 - 3;
    expect(result).toBe(2);
  });

  test('multiplication should work correctly', () => {
    const result = 3 * 4;
    expect(result).toBe(12);
  });

  test('division should work correctly', () => {
    const result = 10 / 2;
    expect(result).toBe(5);
  });
});

describe('String Operations', () => {
  test('concatenation should work correctly', () => {
    const result = 'Hello' + ' ' + 'World';
    expect(result).toBe('Hello World');
  });

  test('uppercase conversion should work', () => {
    const result = 'hello'.toUpperCase();
    expect(result).toBe('HELLO');
  });

  test('string length should be correct', () => {
    const result = 'test'.length;
    expect(result).toBe(4);
  });
});
