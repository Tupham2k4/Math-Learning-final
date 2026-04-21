export const extractLatex = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const regex = /\$\$(.*?)\$\$|\$(.*?)\$/gs;
  const formulas = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Nếu khớp với nhóm 1 ($$), thêm nhóm 1
    if (match[1]) {
      formulas.push(match[1].trim());
    } 
    // Nếu khớp với nhóm 2 ($), thêm nhóm 2
    else if (match[2]) {
      formulas.push(match[2].trim());
    }
  }

  return formulas;
};
