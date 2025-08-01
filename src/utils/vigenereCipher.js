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

export function generateVigenerePuzzle(wordBank, difficultyLevel = 1) {
  // Difficulty affects keyword complexity and length
  const keywordsByDifficulty = {
    1: ['KEY', 'CODE', 'LOCK'],
    2: ['CIPHER', 'SECRET', 'PUZZLE'],
    3: ['QUEST', 'ESCAPE', 'DECODE', 'MYSTERY'],
    4: ['CRYPTOGRAPHY', 'INTELLIGENCE', 'SURVEILLANCE'],
    5: ['RECONNAISSANCE', 'INFILTRATION', 'COUNTERINTELLIGENCE']
  };
  
  const maxLevel = Math.min(difficultyLevel, 5);
  const availableKeywords = [];
  for (let i = 1; i <= maxLevel; i++) {
    availableKeywords.push(...keywordsByDifficulty[i]);
  }
  
  const keyword = availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
  
  // Filter words by difficulty level
  const filteredWords = wordBank.filter(word => {
    const wordLength = word.replace(/\s/g, '').length;
    if (difficultyLevel <= 2) return wordLength <= 14;
    if (difficultyLevel <= 4) return wordLength >= 10 && wordLength <= 20;
    return wordLength >= 15;
  });
  
  const availableWords = filteredWords.length > 0 ? filteredWords : wordBank;
  const originalText = availableWords[Math.floor(Math.random() * availableWords.length)];
  const encodedText = vigenereEncode(originalText, keyword);
  
  return {
    type: 'vigenere',
    difficulty: difficultyLevel,
    encoded: encodedText,
    answer: originalText,
    hint: difficultyLevel <= 2
      ? `Intelligence indicates this is a Vigenère cipher. The keyword appears to be: ${keyword}. Look for repeating patterns to determine keyword length.`
      : difficultyLevel <= 3
      ? `Intelligence confirms Vigenère encryption. Keyword length: ${keyword.length} characters. Analyze pattern repetitions for decryption.`
      : `Advanced Vigenère cipher detected. Use Kasiski examination or index of coincidence to determine keyword structure.`,
    keyword
  };
}