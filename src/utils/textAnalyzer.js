/**
 * Calculates various statistics about the given text
 * @param {string} text - The text to analyze
 * @returns {Object} Object containing various text statistics
 */
export function calculateTextStats(text) {
  // Handle empty text
  if (!text || text.trim() === '') {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      paragraphs: 0,
      readingTime: 0
    };
  }

  // Calculate statistics
  const characters = text.replace(/(\r\n|\n|\r)/gm, "").length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  // Words are sequences of characters separated by whitespace
  // Filter out empty strings for accurate count
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  
  // Paragraphs are separated by one or more line breaks
  // Filter out empty paragraphs
  const paragraphs = text.split(/\n+/).filter(para => para.trim().length > 0).length;
  
  // Calculate reading time in seconds (based on 200 words per minute)
  const wordsPerSecond = 200 / 60;
  const readingTime = Math.ceil(words / wordsPerSecond);
  
  return {
    characters,
    charactersNoSpaces,
    words,
    paragraphs,
    readingTime
  };
}