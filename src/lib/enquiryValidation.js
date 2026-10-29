export const ENQUIRY_LIMITS = { fullName: 120, email: 254, phone: 60, shipmentDetails: 6000 };

// Browser checks only; the external provider is responsible for its own validation.
export function validateEnquiry(input) {
  const values = {};
  for (const [key, limit] of Object.entries(ENQUIRY_LIMITS)) {
    if (typeof input?.[key] !== 'string' || input[key].length > limit) return null;
    values[key] = input[key].trim();
  }
  if (!values.fullName || !values.shipmentDetails || /[\r\n]/.test(input.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return null;
  return values;
}
