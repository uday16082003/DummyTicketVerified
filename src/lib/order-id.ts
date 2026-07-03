const ORDER_ID_PREFIX = "DTV";
// Excludes visually ambiguous characters (0, 1, O, I).
const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length: number): string {
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return result;
}

/**
 * Generates a unique, human-readable order ID, e.g. "DTV-20260702-K3F9QZ".
 * Format: <prefix>-<yyyymmdd>-<6 random chars>
 */
export function generateOrderId(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${ORDER_ID_PREFIX}-${year}${month}${day}-${randomSegment(6)}`;
}
