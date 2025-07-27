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

export function generateCaesarPuzzle(wordBank) {
  const shift = Math.floor(Math.random() * 25) + 1;
  const originalText = wordBank[Math.floor(Math.random() * wordBank.length)];
  const encodedText = caesarEncode(originalText, shift);
  
  return {
    type: 'caesar',
    encoded: encodedText,
    answer: originalText,
    hint: `This is a Caesar cipher. Each letter is shifted by ${shift} positions in the alphabet.`,
    shift
  };
}