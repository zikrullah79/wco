const STORAGE_KEY = 'character-calculator-text';

/**
 * Saves text to local storage
 * @param {string} text - The text to save
 */
export function saveTextToLocalStorage(text) {
  localStorage.setItem(STORAGE_KEY, text);
}

/**
 * Retrieves text from local storage
 * @returns {string} The saved text or empty string if none exists
 */
export function getTextFromLocalStorage() {
  return localStorage.getItem(STORAGE_KEY) || '';
}