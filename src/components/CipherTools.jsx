import React, { useState, useEffect } from 'react';
import { Calculator, Hash, Shuffle, RotateCcw } from 'lucide-react';

const CipherTools = ({ puzzle, onToolResult }) => {
  const [activeTab, setActiveTab] = useState('frequency');
  const [caesarShift, setCaesarShift] = useState(1);
  const [substitutionMap, setSubstitutionMap] = useState({});
  const [workingText, setWorkingText] = useState('');

  useEffect(() => {
    if (puzzle) {
      setWorkingText(puzzle.encoded);
      setSubstitutionMap({});
    }
  }, [puzzle]);

  if (!puzzle) return null;

  // Frequency Analysis Tool
  const getFrequencyAnalysis = (text) => {
    const freq = {};
    const cleanText = text.replace(/[^A-Z]/g, '');
    
    for (let char of cleanText) {
      freq[char] = (freq[char] || 0) + 1;
    }
    
    return Object.entries(freq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

  // Caesar Cipher Tool
  const applyCaesarShift = (text, shift) => {
    return text
      .split('')
      .map(char => {
        if (char >= 'A' && char <= 'Z') {
          return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        }
        return char;
      })
      .join('');
  };

  // Symbol Substitution Tool
  const applySubstitution = (text) => {
    return text
      .split('')
      .map(char => substitutionMap[char] || char)
      .join('');
  };

  const updateSubstitution = (symbol, letter) => {
    setSubstitutionMap(prev => ({
      ...prev,
      [symbol]: letter.toUpperCase()
    }));
  };

  const clearSubstitution = () => {
    setSubstitutionMap({});
  };

  const getUniqueSymbols = (text) => {
    return [...new Set(text.split('').filter(char => char !== ' '))];
  };

  const renderFrequencyTool = () => {
    const frequencies = getFrequencyAnalysis(workingText);
    const commonLetters = ['E', 'T', 'A', 'O', 'I', 'N', 'S', 'H', 'R', 'D'];

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-cyan-400 mb-3">Letter Frequency Analysis</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-2">Most Common in Cipher:</p>
            <div className="space-y-1">
              {frequencies.map(([char, count], index) => (
                <div key={char} className="flex justify-between items-center text-sm">
                  <span className="font-mono text-cyan-300">{char}</span>
                  <span className="text-gray-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Common English Letters:</p>
            <div className="space-y-1">
              {commonLetters.slice(0, frequencies.length).map((letter, index) => (
                <div key={letter} className="flex justify-between items-center text-sm">
                  <span className="font-mono text-green-400">{letter}</span>
                  <span className="text-gray-500">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCaesarTool = () => {
    const shiftedText = applyCaesarShift(workingText, caesarShift);

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-cyan-400 mb-3">Caesar Cipher Decoder</h4>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-300">Shift:</label>
          <input
            type="range"
            min="1"
            max="25"
            value={caesarShift}
            onChange={(e) => setCaesarShift(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-cyan-400 font-mono w-8">{caesarShift}</span>
        </div>
        <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Decoded with shift {caesarShift}:</p>
          <p className="font-mono text-green-300 break-all">{shiftedText}</p>
        </div>
        <button
          onClick={() => onToolResult && onToolResult(shiftedText)}
          className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white text-sm font-semibold rounded-lg transition-all duration-300"
        >
          Use This Result
        </button>
      </div>
    );
  };

  const renderSubstitutionTool = () => {
    const symbols = getUniqueSymbols(workingText);
    const decodedText = applySubstitution(workingText);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-cyan-400">Symbol Substitution</h4>
          <button
            onClick={clearSubstitution}
            className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {symbols.map(symbol => (
            <div key={symbol} className="flex items-center space-x-2">
              <span className="font-mono text-cyan-300 w-6 text-center">{symbol}</span>
              <span className="text-gray-500">→</span>
              <input
                type="text"
                maxLength="1"
                value={substitutionMap[symbol] || ''}
                onChange={(e) => updateSubstitution(symbol, e.target.value)}
                className="w-8 h-8 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded text-center text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                placeholder="?"
              />
            </div>
          ))}
        </div>

        <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Current substitution:</p>
          <p className="font-mono text-green-300 break-all">{decodedText}</p>
        </div>

        <button
          onClick={() => onToolResult && onToolResult(decodedText)}
          className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white text-sm font-semibold rounded-lg transition-all duration-300"
        >
          Use This Result
        </button>
      </div>
    );
  };

  const getToolsForPuzzleType = () => {
    switch (puzzle.type) {
      case 'caesar':
        return ['frequency', 'caesar'];
      case 'vigenere':
        return ['frequency'];
      case 'symbol':
        return ['frequency', 'substitution'];
      default:
        return ['frequency'];
    }
  };

  const availableTools = getToolsForPuzzleType();

  return (
    <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-cyan-400">Cipher Tools</h3>
      </div>

      <div className="flex space-x-2 mb-4">
        {availableTools.includes('frequency') && (
          <button
            onClick={() => setActiveTab('frequency')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
              activeTab === 'frequency'
                ? 'bg-cyan-500 text-black'
                : 'bg-[rgba(255,255,255,0.05)] text-gray-300 hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            <Hash className="w-3 h-3 inline mr-1" />
            Frequency
          </button>
        )}
        {availableTools.includes('caesar') && (
          <button
            onClick={() => setActiveTab('caesar')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
              activeTab === 'caesar'
                ? 'bg-cyan-500 text-black'
                : 'bg-[rgba(255,255,255,0.05)] text-gray-300 hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            <RotateCcw className="w-3 h-3 inline mr-1" />
            Caesar
          </button>
        )}
        {availableTools.includes('substitution') && (
          <button
            onClick={() => setActiveTab('substitution')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
              activeTab === 'substitution'
                ? 'bg-cyan-500 text-black'
                : 'bg-[rgba(255,255,255,0.05)] text-gray-300 hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            <Shuffle className="w-3 h-3 inline mr-1" />
            Substitution
          </button>
        )}
      </div>

      <div className="min-h-[200px]">
        {activeTab === 'frequency' && renderFrequencyTool()}
        {activeTab === 'caesar' && renderCaesarTool()}
        {activeTab === 'substitution' && renderSubstitutionTool()}
      </div>
    </div>
  );
};

export default CipherTools;