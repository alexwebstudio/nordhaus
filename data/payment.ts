/** Способы оплаты. Все тексты и условия — в messages/*.json → payment.methods. */
export const paymentSlugs = ["mortgage", "installment", "subsidy", "cashless"] as const;
export type PaymentSlug = (typeof paymentSlugs)[number];

/** чередование светлая/тёмная карточка на главной */
export const paymentTone: Record<PaymentSlug, "light" | "dark"> = {
  mortgage: "light",
  installment: "dark",
  subsidy: "light",
  cashless: "dark",
};

export const isPaymentSlug = (s: string): s is PaymentSlug => (paymentSlugs as readonly string[]).includes(s);
