/**
 * Helper to sanitize JSON response from LLMs (removes markdown code blocks if generated)
 * @param {string} text - Raw string output from generative model
 * @returns {string} Sanitized clean JSON string
 */
const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
};

module.exports = {
  cleanJsonResponse,
};
