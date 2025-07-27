import React, { useState, useEffect } from 'react';
import PuzzleBox from './PuzzleBox';
import MissionBriefing from './MissionBriefing';
import { generateCaesarPuzzle } from '../utils/caesarCipher';
import { generateVigenerePuzzle } from '../utils/vigenereCipher';
import { generateSymbolPuzzle } from '../utils/symbolCipher';
import { useTimer } from '../utils/timer';
import { saveScore } from '../utils/storage';
import { WORD_BANK } from '../utils/wordBank';
import { getMissionForPuzzle, getCompletionMessage, getRandomAtmosphericMessage } from '../utils/narrative';

const PUZZLES = [
  { type: 'caesar', generator: generateCaesarPuzzle },
  { type: 'vigenere', generator: generateVigenerePuzzle },
  { type: 'symbol', generator: generateSymbolPuzzle }
];

const Game = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(-1);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, completed
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({ isCorrect: false, isIncorrect: false });
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [showMissionBriefing, setShowMissionBriefing] = useState(false);
  const [atmosphericMessage, setAtmosphericMessage] = useState('');
  
  const timer = useTimer();

  // Initialize first puzzle
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
      
      // Set mission for current puzzle
      const mission = getMissionForPuzzle(puzzleIndex);
      setCurrentMission(mission);
      
      // Show mission briefing for new missions
      if (mission && puzzleIndex > 0) {
        setShowMissionBriefing(true);
      }
      
      setShowHint(false);
      setFeedback({ isCorrect: false, isIncorrect: false });
      
      // Set atmospheric message
      if (puzzleIndex > 0) {
        setAtmosphericMessage(getRandomAtmosphericMessage('progress'));
      }
    } else {
      // Game completed
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
      
      // Show completion message
      const completionMsg = getCompletionMessage(currentPuzzleIndex);
      if (completionMsg) {
        setAtmosphericMessage(completionMsg.message);
      }
      
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
    
    // Show completion message
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
    setCurrentMission(null);
    setShowMissionBriefing(false);
    setAtmosphericMessage('');
    timer.reset();
    
    // Restart the game
    setTimeout(() => {
      startGame();
    }, 100);
  };

  if (gameState === 'waiting') {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-xl p-8 text-center">
            {/* Game Logo */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-2xl">C</span>
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CipherQuest
              </h2>
              <p className="text-cyan-400 text-sm font-medium">Operation: Digital Infiltration</p>
            </div>

            {/* Mission Overview */}
            <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Mission Brief</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                You are Agent Cipher, tasked with infiltrating a secure digital facility. 
                Each room contains encrypted intelligence that must be decoded to progress deeper into the system.
              </p>
            </div>

            {/* Objectives */}
            <div className="text-left mb-6">
              <h4 className="text-sm font-semibold text-cyan-400 mb-3">PRIMARY OBJECTIVES:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Breach Security Checkpoint Alpha (Caesar Cipher)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Access Central Database (Vigenère Cipher)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Override Vault Protocol (Symbol Substitution)</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                const firstMission = getMissionForPuzzle(0);
                setCurrentMission(firstMission);
                setShowMissionBriefing(true);
              }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105"
            >
              Accept Mission
            </button>
          </div>
        </div>
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
      {/* Mission Briefing Modal */}
      <MissionBriefing 
        mission={currentMission}
        isVisible={showMissionBriefing}
        onClose={() => {
          setShowMissionBriefing(false);
          if (gameState === 'waiting') {
            startGame();
          }
        }}
      />

      {/* Atmospheric Message */}
      {atmosphericMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-top-2 duration-500">
          <div className="bg-[rgba(0,0,0,0.9)] border border-cyan-500/30 backdrop-blur-md rounded-lg px-4 py-2 max-w-md">
            <p className="text-cyan-300 text-sm text-center font-medium">
              {atmosphericMessage}
            </p>
          </div>
        </div>
      )}

      <PuzzleBox
        puzzle={currentPuzzle}
        mission={currentMission}
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