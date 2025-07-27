import React, { useState, useEffect } from 'react';
import PuzzleBox from './PuzzleBox';
import { generateCaesarPuzzle } from '../utils/caesarCipher';
import { generateVigenerePuzzle } from '../utils/vigenereCipher';
import { generateSymbolPuzzle } from '../utils/symbolCipher';
import { useTimer } from '../utils/timer';
import { saveScore } from '../utils/storage';
import { WORD_BANK } from '../utils/wordBank';

const PUZZLES = [
  { type: 'caesar', generator: generateCaesarPuzzle },
  { type: 'vigenere', generator: generateVigenerePuzzle },
  { type: 'symbol', generator: generateSymbolPuzzle }
];

const Game = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(-1);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({ isCorrect: false, isIncorrect: false });
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  
  const timer = useTimer();

  useEffect(() => {
    if (currentPuzzleIndex === -1) {
      startGame();
    }
  }, []);

  const startGame = () => {
    setCurrentPuzzleIndex(0);
    setGameState('playing');
    timer.reset();
    timer.start();
    generateNextPuzzle(0);
  };

  const generateNextPuzzle = (puzzleIndex) => {
    if (puzzleIndex < PUZZLES.length) {
      const puzzleConfig = PUZZLES[puzzleIndex];
      const newPuzzle = puzzleConfig.generator(WORD_BANK);
      setCurrentPuzzle(newPuzzle);
      setShowHint(false);
      setFeedback({ isCorrect: false, isIncorrect: false });
    } else {
      completeGame();
    }
  };

  const completeGame = () => {
    timer.stop();
    setGameState('completed');
    setShowNameInput(true);
  };

  const handleSubmit = (answer) => {
    if (!currentPuzzle) return;

    const isCorrect = answer === currentPuzzle.answer;
    
    if (isCorrect) {
      setFeedback({ isCorrect: true, isIncorrect: false });
      
      setTimeout(() => {
        const nextIndex = currentPuzzleIndex + 1;
        setCurrentPuzzleIndex(nextIndex);
        generateNextPuzzle(nextIndex);
      }, 1500);
    } else {
      setFeedback({ isCorrect: false, isIncorrect: true });
      
      setTimeout(() => {
        setFeedback({ isCorrect: false, isIncorrect: false });
      }, 1000);
    }
  };

  const handleSkip = () => {
    const nextIndex = currentPuzzleIndex + 1;
    setCurrentPuzzleIndex(nextIndex);
    generateNextPuzzle(nextIndex);
  };

  const handleHint = () => {
    setShowHint(true);
  };

  const handleSaveScore = () => {
    const finalPlayerName = playerName.trim() || 'Anonymous';
    saveScore(finalPlayerName, timer.seconds, currentPuzzleIndex);
    setShowNameInput(false);
    
    setTimeout(() => {
      if (window.confirm('Game completed! Play again?')) {
        restartGame();
      }
    }, 100);
  };

  const restartGame = () => {
    setCurrentPuzzleIndex(-1);
    setCurrentPuzzle(null);
    setGameState('waiting');
    setShowHint(false);
    setFeedback({ isCorrect: false, isIncorrect: false });
    setPlayerName('');
    setShowNameInput(false);
    timer.reset();
    
    setTimeout(() => {
      startGame();
    }, 100);
  };

  if (gameState === 'waiting') {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <PuzzleBox 
          puzzle={null}
          timer={timer.formattedTime}
        />
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Congratulations!
            </h2>
            <p className="text-gray-300 mb-6">
              You've completed {currentPuzzleIndex} rooms in {timer.formattedTime}!
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter your name for the leaderboard:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Your name (optional)"
                autoComplete="off"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveScore()}
              />
            </div>
            
            <button
              onClick={handleSaveScore}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-105"
            >
              Save Score
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <PuzzleBox
        puzzle={currentPuzzle}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
        onHint={handleHint}
        isCorrect={feedback.isCorrect}
        isIncorrect={feedback.isIncorrect}
        showHint={showHint}
        timer={timer.formattedTime}
      />
    </div>
  );
};

export default Game;