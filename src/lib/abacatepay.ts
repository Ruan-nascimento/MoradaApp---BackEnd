import { AbacatePay } from "@abacatepay/sdk";


const abacatePayKey = process.env.ABACATEPAY_API_KEY || process.env.ABACATE_PAY_KEY;

export const abacate = AbacatePay({
  secret: abacatePayKey || "",
});
