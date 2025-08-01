// Caesar Cipher utilities
export function caesarEncode(text, shift) {
  return text
    .toUpperCase()
    .split('')
    .map(char => {
      if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      return char;
    })
    .join('');
}

export function caesarDecode(text, shift) {
  return caesarEncode(text, 26 - shift);
}

export function generateCaesarPuzzle(wordBank, difficultyLevel = 1) {
  // Difficulty affects shift range and word complexity
  const minShift = Math.min(1 + Math.floor(difficultyLevel / 2), 10);
  const maxShift = Math.min(5 + difficultyLevel * 3, 25);
  const shift = Math.floor(Math.random() * (maxShift - minShift + 1)) + minShift;
  
  // Filter words by difficulty level
  const filteredWords = wordBank.filter(word => {
    const wordLength = word.replace(/\s/g, '').length;
    if (difficultyLevel <= 2) return wordLength <= 12;
    if (difficultyLevel <= 4) return wordLength >= 8 && wordLength <= 18;
    return wordLength >= 12;
  });
  
  const availableWords = filteredWords.length > 0 ? filteredWords : wordBank;
  const originalText = availableWords[Math.floor(Math.random() * availableWords.length)];
  const encodedText = caesarEncode(originalText, shift);
  
  return {
    type: 'caesar',
    difficulty: difficultyLevel,
    encoded: encodedText,
    answer: originalText,
    hint: difficultyLevel <= 2 
      ? `Intelligence suggests this is a Caesar cipher. Each letter has been shifted by ${shift} positions in the alphabet. Try frequency analysis or systematic shifting.`
      : `Intelligence confirms Caesar cipher encryption. Advanced shift pattern detected. Use frequency analysis or systematic decryption methods.`,
    shift
  };
}