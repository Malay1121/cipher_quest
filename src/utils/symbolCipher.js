// Symbol Substitution Cipher utilities
const SYMBOLS = [
  '∆', '◊', '∇', '◈', '◉', '◯', '◎', '●', '◐', '◑', '◒', '◓', '⬢', '⬡', '⬟', '⬞',
  '⧫', '⧪', '⧬', '⟐', '⟑', '⟒', '⟓', '⟔', '⟕', '⟖'
];

export function generateSymbolMapping() {
  const shuffledSymbols = [...SYMBOLS].sort(() => Math.random() - 0.5);
  const mapping = {};
  const reverseMapping = {};
  
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const symbol = shuffledSymbols[i];
    mapping[letter] = symbol;
    reverseMapping[symbol] = letter;
  }
  
  return { mapping, reverseMapping };
}

export function symbolEncode(text, mapping) {
  return text
    .toUpperCase()
    .split('')
    .map(char => {
      if (char >= 'A' && char <= 'Z') {
        return mapping[char] || char;
      }
      return char === ' ' ? ' ' : char;
    })
    .join('');
}

export function symbolDecode(text, reverseMapping) {
  return text
    .split('')
    .map(char => reverseMapping[char] || char)
    .join('');
}

export function generateSymbolPuzzle(wordBank, difficultyLevel = 1) {
  const { mapping, reverseMapping } = generateSymbolMapping();
  
  // Filter words by difficulty level
  const filteredWords = wordBank.filter(word => {
    const wordLength = word.replace(/\s/g, '').length;
    if (difficultyLevel <= 2) return wordLength <= 10;
    if (difficultyLevel <= 4) return wordLength >= 8 && wordLength <= 16;
    return wordLength >= 12;
  });
  
  const availableWords = filteredWords.length > 0 ? filteredWords : wordBank;
  const originalText = availableWords[Math.floor(Math.random() * availableWords.length)];
  const encodedText = symbolEncode(originalText, mapping);
  
  return {
    type: 'symbol',
    difficulty: difficultyLevel,
    encoded: encodedText,
    answer: originalText,
    hint: difficultyLevel <= 2
      ? 'Intelligence confirms this is a symbol substitution cipher. Each letter has been replaced with a unique symbol. Use frequency analysis - the most common symbol likely represents E or T.'
      : difficultyLevel <= 3
      ? 'Advanced symbol substitution detected. Apply frequency analysis and pattern recognition. Look for single-symbol words and common letter combinations.'
      : 'Complex symbolic encryption identified. Utilize advanced cryptanalytic techniques including frequency analysis, pattern matching, and linguistic structure analysis.',
    mapping,
    reverseMapping
  };
}