import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

/**
 * Verifica si las credenciales de Stripe están configuradas.
 * Retorna true si ambas claves existen.
 */
export const isStripeConfigured = (): boolean => {
  return Boolean(stripeSecretKey && stripePublishableKey);
};

export const stripe = new Stripe(stripeSecretKey || "sk_placeholder_no_configurado", {
  apiVersion: "2025-02-24.acacia" as any,
  appInfo: {
    name: "Academia SEA Payments",
    version: "1.0.0",
  },
});

export const getStripePublishableKey = () => {
  return stripePublishableKey;
};
