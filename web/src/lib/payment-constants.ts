export const VA_BANKS = ["BCA", "Mandiri", "BNI", "BRI", "Permata"] as const;
export type VaBank = (typeof VA_BANKS)[number];
