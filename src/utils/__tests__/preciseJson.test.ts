import { BigIntValue, parseJsonPreservingBigInts } from '../preciseJson';

describe('preciseJson', () => {
  it('keeps integers beyond the safe range intact', () => {
    const parsed = parseJsonPreservingBigInts('{"id": 10765432100123456789}');

    expect(parsed.id).toBeInstanceOf(BigIntValue);
    expect(parsed.id.text).toBe('10765432100123456789');
  });

  it('keeps negative integers beyond the safe range intact', () => {
    const parsed = parseJsonPreservingBigInts('{"id": -9223372036854775808}');

    expect(parsed.id.text).toBe('-9223372036854775808');
  });

  it('leaves integers a double can hold exactly as plain numbers', () => {
    const parsed = parseJsonPreservingBigInts(
      '{"small": 42, "maxSafe": 9007199254740991, "minSafe": -9007199254740991}',
    );

    expect(parsed.small).toBe(42);
    expect(parsed.maxSafe).toBe(9007199254740991);
    expect(parsed.minSafe).toBe(-9007199254740991);
  });

  it('works for values nested in objects and arrays', () => {
    const parsed = parseJsonPreservingBigInts(
      '{"data": {"rows": [{"ts": 10765432100123456789}, 1, "plain"]}}',
    );

    expect(parsed.data.rows[0].ts.text).toBe('10765432100123456789');
    expect(parsed.data.rows[1]).toBe(1);
    expect(parsed.data.rows[2]).toBe('plain');
  });

  it('does not touch digits inside string values', () => {
    const parsed = parseJsonPreservingBigInts('{"note": "snowflake 10765432100123456789"}');

    expect(parsed.note).toBe('snowflake 10765432100123456789');
  });

  it('does not wrap floats or exponent numbers', () => {
    const parsed = parseJsonPreservingBigInts('{"ratio": 1.5, "scaled": 1.5e3}');

    expect(parsed.ratio).toBe(1.5);
    expect(parsed.scaled).toBe(1500);
  });

  it('handles escaped quotes and backslashes around numbers', () => {
    const parsed = parseJsonPreservingBigInts(
      '{"q": "a \\"10765432100123456789\\" b", "id": 10765432100123456789}',
    );

    expect(parsed.q).toBe('a "10765432100123456789" b');
    expect(parsed.id.text).toBe('10765432100123456789');
  });

  it('serializes back to JSON without losing digits', () => {
    const parsed = parseJsonPreservingBigInts('{"id": 10765432100123456789, "small": 7}');

    // the value is emitted as a JSON string, which keeps every digit
    expect(JSON.stringify(parsed, null, 2)).toBe(
      '{\n  "id": "10765432100123456789",\n  "small": 7\n}',
    );
  });

  it('rejects invalid JSON like JSON.parse does', () => {
    expect(() => parseJsonPreservingBigInts('{"id": ')).toThrow();
  });
});
