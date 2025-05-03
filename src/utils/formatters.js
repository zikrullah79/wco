/**
 * Formats a number with thousands separators
 * @param {number} num - The number to format
 * @returns {string} The formatted number
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}