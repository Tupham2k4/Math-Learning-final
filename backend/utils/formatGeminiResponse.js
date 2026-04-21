export const formatGeminiResponse = (text) => {
  if (!text || typeof text !== "string") {
    return "";
  }
  let formattedText = text.trim();
  formattedText = formattedText.replace(/\n{3,}/g, "\n\n");
  return formattedText;
};
