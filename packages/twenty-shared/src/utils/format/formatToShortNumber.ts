// Leadzen CRM: short numbers use the Indian scale (K, lakh, crore) instead of k/m/b,
// e.g. 58_00_000 -> "58 L", 3_88_00_000 -> "3.88 Cr".
const SHORT_NUMBER_UNITS_BELOW_CRORE = [
  { size: 1, suffix: '', decimals: 1, limit: 1_000 },
  { size: 1_000, suffix: 'K', decimals: 1, limit: 100 },
  { size: 1_00_000, suffix: ' L', decimals: 2, limit: 100 },
];

const CRORE_UNIT = { size: 1_00_00_000, suffix: ' Cr', decimals: 2 };

export const formatToShortNumber = (amount: number) => {
  const sign = amount < 0 ? '-' : '';
  const absoluteAmount = Math.abs(amount);

  // Promote to the next unit when rounding reaches the limit (99_999 -> "1 L", not "100K")
  const unit =
    SHORT_NUMBER_UNITS_BELOW_CRORE.find(
      ({ size, decimals, limit }) =>
        Number((absoluteAmount / size).toFixed(decimals)) < limit,
    ) ?? CRORE_UNIT;

  return (
    sign +
    (absoluteAmount / unit.size)
      .toFixed(unit.decimals)
      .replace(/\.?0+$/, '') +
    unit.suffix
  );
};
