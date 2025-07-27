import React, { useState, useEffect } from 'react';
import { Lightbulb, SkipForward, Send } from 'lucide-react';

const PuzzleBox = ({ 
  puzzle, 
  onSubmit, 
  onSkip, 
  onHint, 
  isCorrect, 
  isIncorrect, 
  showHint,
  timer 
}) => {
  const [answer, setAnswer] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isIncorrect) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  }, [isIncorrect]);

  useEffect(() => {
    if (isCorrect) {
      setAnswer('');
    }
  }, [isCorrect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim().toUpperCase());
    }
  };

  const getRoomTitle = (type) => {
    switch (type) {
      case 'caesar': return 'Room 1: Caesar Cipher';
      case 'vigenere': return 'Room 2: Vigenère Cipher';
      case 'symbol': return 'Room 3: Symbol Substitution';
      default: return 'Mystery Room';
    }
  };

  if (!puzzle) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Welcome to CipherQuest
          </h2>
          <p className="text-gray-300 mb-6">
            Decode the ciphers to escape each room. Are you ready to begin?
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-xl p-8 transition-all duration-300 ${
        isCorrect ? 'shadow-lg shadow-green-500/30 border-green-500/30' :
        isIncorrect ? 'shadow-lg shadow-red-500/30 border-red-500/30' : ''
      } ${isShaking ? 'animate-pulse' : ''}`}>
        
        {/* Room Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-2">
            {getRoomTitle(puzzle.type)}
          </h2>
          <div className="text-sm text-gray-400">
            Time: <span className="font-mono text-cyan-300">{timer}</span>
          </div>
        </div>

        {/* Cipher Display */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Decode this cipher:
          </label>
          <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 font-mono text-lg text-center letter-spacing-wide">
            <span className="text-cyan-100 break-all">
              {puzzle.encoded}
            </span>
          </div>
        </div>

        {/* Hint Display */}
        {showHint && (
          <div className="mb-6 p-4 bg-[rgba(255,193,7,0.1)] border border-[rgba(255,193,7,0.3)] rounded-lg">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-200 text-sm">{puzzle.hint}</p>
            </div>
          </div>
        )}

        {/* Answer Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your answer:
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-lg"
              placeholder="Enter decoded message..."
              autoComplete="off"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!answer.trim()}
              className="flex-1 min-w-[120px] flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Submit</span>
            </button>

            <button
              type="button"
              onClick={onHint}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-[rgba(255,193,7,0.1)] hover:bg-[rgba(255,193,7,0.2)] border border-[rgba(255,193,7,0.3)] text-yellow-400 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Hint</span>
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-[rgba(255,107,107,0.1)] hover:bg-[rgba(255,107,107,0.2)] border border-[rgba(255,107,107,0.3)] text-red-400 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PuzzleBox;