export const generateChatTitle = (message) => {
  if (!message || typeof message !== "string") {
    return "Cuộc trò chuyện mới";
  }

  const words = message.trim().split(/\s+/);
  
  // Giới hạn từ tối đa = 8
  const maxWords = 8;

  if (words.length <= maxWords) {
    return words.join(" ");
  }

  return words.slice(0, maxWords).join(" ") + "...";
};
