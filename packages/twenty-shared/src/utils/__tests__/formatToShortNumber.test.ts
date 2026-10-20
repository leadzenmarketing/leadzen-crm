import { formatToShortNumber } from '../format/formatToShortNumber';

describe('formatToShortNumber', () => {
  it('formats numbers less than 1000 correctly', () => {
    expect(formatToShortNumber(500)).toBe('500');
    expect(formatToShortNumber(123.456)).toBe('123.5');
  });

  it('formats thousands with K', () => {
    expect(formatToShortNumber(1500)).toBe('1.5K');
    expect(formatToShortNumber(45000)).toBe('45K');
  });

  it('formats lakhs with L', () => {
    expect(formatToShortNumber(580000)).toBe('5.8 L');
    expect(formatToShortNumber(5800000)).toBe('58 L');
    expect(formatToShortNumber(789456)).toBe('7.89 L');
  });

  it('formats crores with Cr', () => {
    expect(formatToShortNumber(38800000)).toBe('3.88 Cr');
    expect(formatToShortNumber(1200000000)).toBe('120 Cr');
    expect(formatToShortNumber(987654321987)).toBe('98765.43 Cr');
  });

  it('handles numbers with decimal places correctly', () => {
    expect(formatToShortNumber(123.456)).toBe('123.5');
    expect(formatToShortNumber(789.0123)).toBe('789');
  });

  it('handles zero correctly', () => {
    expect(formatToShortNumber(0)).toBe('0');
  });

  it('promotes to the next unit when rounding reaches the boundary', () => {
    expect(formatToShortNumber(999.96)).toBe('1K');
    expect(formatToShortNumber(99999)).toBe('1 L');
    expect(formatToShortNumber(99995000)).toBe('10 Cr');
  });

  it('does not promote just below a rounding boundary', () => {
    expect(formatToShortNumber(99949)).toBe('99.9K');
    expect(formatToShortNumber(999)).toBe('999');
  });

  describe('negative numbers', () => {
    it('formats negative numbers less than 1000 correctly', () => {
      expect(formatToShortNumber(-500)).toBe('-500');
      expect(formatToShortNumber(-123.456)).toBe('-123.5');
    });

    it('formats negative thousands, lakhs and crores correctly', () => {
      expect(formatToShortNumber(-1500)).toBe('-1.5K');
      expect(formatToShortNumber(-5800000)).toBe('-58 L');
      expect(formatToShortNumber(-38800000)).toBe('-3.88 Cr');
    });
  });
});
