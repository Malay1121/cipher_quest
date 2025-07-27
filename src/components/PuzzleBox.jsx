import React, { useState, useEffect } from 'react';
import { Lightbulb, SkipForward, Send, Wrench } from 'lucide-react';
import CipherTools from './CipherTools';

const PuzzleBox = ({ 
  puzzle, 
  mission,
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
  const [showTools, setShowTools] = useState(false);

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

  const handleToolResult = (result) => {
    setAnswer(result);
  };

  const getRoomTitle = (type) => {
    switch (type) {
      case 'caesar': return 'Security Checkpoint Alpha';
      case 'vigenere': return 'Central Database Access';
      case 'symbol': return 'Vault Protocol Override';
      default: return 'Mystery Room';
    }
  };

  if (!puzzle) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-xl p-8 transition-all duration-300 ${
        isCorrect ? 'shadow-lg shadow-green-500/30 border-green-500/30' :
        isIncorrect ? 'shadow-lg shadow-red-500/30 border-red-500/30' : ''
      } ${isShaking ? 'animate-pulse' : ''}`}>
        
        {/* Mission Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-cyan-400 font-medium tracking-wider">ACTIVE MISSION</span>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-lg font-bold text-white mb-1">
            {getRoomTitle(puzzle.type)}
          </h2>
          {mission && (
            <p className="text-sm text-gray-400 mb-3">
              {mission.location}
            </p>
          )}
          <div className="text-sm text-gray-400">
            <span className="text-cyan-300">Agent Status:</span> Active • 
            Time: <span className="font-mono text-cyan-300">{timer}</span>
          </div>
        </div>

        {/* Mission Objective Reminder */}
        {mission && (
          <div className="bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-400 mb-1">CURRENT OBJECTIVE:</p>
            <p className="text-sm text-cyan-300 font-medium">{mission.objective}</p>
          </div>
        )}

        {/* Cipher Display */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Encrypted Intelligence:
          </label>
          <div className="bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 font-mono text-lg text-center letter-spacing-wide relative">
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-cyan-100 break-all">
              {puzzle.encoded}
            </span>
          </div>
        </div>

        {/* Hint Display */}
        {showHint && (
          <div className="mb-6 p-4 bg-[rgba(255,193,7,0.1)] border border-[rgba(255,193,7,0.3)] rounded-lg">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-yellow-400 font-medium mb-1">INTELLIGENCE BRIEFING:</p>
                <p className="text-yellow-200 text-sm">{puzzle.hint}</p>
              </div>
            </div>
          </div>
        )}

        {/* Answer Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Decryption Result:
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-lg"
              placeholder="Enter decrypted intelligence..."
              autoComplete="off"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={!answer.trim()}
              className="flex-1 min-w-[100px] flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Transmit</span>
            </button>

            <button
              type="button"
              onClick={onHint}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-[rgba(255,193,7,0.1)] hover:bg-[rgba(255,193,7,0.2)] border border-[rgba(255,193,7,0.3)] text-yellow-400 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Intel</span>
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-[rgba(255,107,107,0.1)] hover:bg-[rgba(255,107,107,0.2)] border border-[rgba(255,107,107,0.3)] text-red-400 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              <SkipForward className="w-4 h-4" />
              <span>Bypass</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTools(!showTools)}
              className={`flex items-center justify-center space-x-2 px-4 py-3 border font-semibold rounded-lg transition-all duration-300 ${
                showTools 
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                  : 'bg-[rgba(147,51,234,0.1)] hover:bg-[rgba(147,51,234,0.2)] border-[rgba(147,51,234,0.3)] text-purple-400 hover:shadow-lg hover:shadow-purple-500/20'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Decrypt</span>
            </button>
          </div>
        </form>

        {/* Cipher Tools */}
        {showTools && (
          <CipherTools 
            puzzle={puzzle} 
            onToolResult={handleToolResult}
          />
        )}
      </div>
    </div>
  );
};

export default PuzzleBox;