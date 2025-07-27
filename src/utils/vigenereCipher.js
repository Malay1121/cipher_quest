// Vigenère Cipher utilities
export function vigenereEncode(text, keyword) {
  const normalizedText = text.toUpperCase().replace(/[^A-Z]/g, '');
  const normalizedKeyword = keyword.toUpperCase();
  
  return normalizedText
    .split('')
    .map((char, index) => {
      const textCharCode = char.charCodeAt(0) - 65;
      const keyCharCode = normalizedKeyword[index % normalizedKeyword.length].charCodeAt(0) - 65;
      return String.fromCharCode(((textCharCode + keyCharCode) % 26) + 65);
    })
    .join('');
}

export function vigenereDecode(text, keyword) {
  const normalizedText = text.toUpperCase().replace(/[^A-Z]/g, '');
  const normalizedKeyword = keyword.toUpperCase();
  
  return normalizedText
    .split('')
    .map((char, index) => {
      const textCharCode = char.charCodeAt(0) - 65;
      const keyCharCode = normalizedKeyword[index % normalizedKeyword.length].charCodeAt(0) - 65;
      return String.fromCharCode(((textCharCode - keyCharCode + 26) % 26) + 65);
    })
    .join('');
}

export function generateVigenerePuzzle(wordBank) {
  const keywords = ['CIPHER', 'SECRET', 'PUZZLE', 'QUEST', 'ESCAPE', 'DECODE', 'MYSTERY'];
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const originalText = wordBank[Math.floor(Math.random() * wordBank.length)];
  const encodedText = vigenereEncode(originalText, keyword);
  
  return {
    type: 'vigenere',
    encoded: encodedText,
    answer: originalText,
    hint: `Intelligence indicates this is a Vigenère cipher. The keyword appears to be: ${keyword}. Look for repeating patterns to determine keyword length.`,
    keyword
  };
}