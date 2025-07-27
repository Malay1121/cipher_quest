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

export function generateSymbolPuzzle(wordBank) {
  const { mapping, reverseMapping } = generateSymbolMapping();
  const originalText = wordBank[Math.floor(Math.random() * wordBank.length)];
  const encodedText = symbolEncode(originalText, mapping);
  
  return {
    type: 'symbol',
    encoded: encodedText,
    answer: originalText,
    hint: 'This is a symbol substitution cipher. Each letter is replaced with a unique symbol.',
    mapping,
    reverseMapping
  };
}