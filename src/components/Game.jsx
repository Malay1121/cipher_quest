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

const CIPHER_GENERATORS = {
  caesar: generateCaesarPuzzle,
  vigenere: generateVigenerePuzzle,
  symbol: generateSymbolPuzzle
};

const CIPHER_TYPES = ['caesar', 'vigenere', 'symbol'];

const Game = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [puzzleQueue, setPuzzleQueue] = useState([]);
  const [currentDifficultyLevel, setCurrentDifficultyLevel] = useState(1);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, completed
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({ isCorrect: false, isIncorrect: false });
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [showMissionBriefing, setShowMissionBriefing] = useState(false);
  const [atmosphericMessage, setAtmosphericMessage] = useState('');
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [missionStatus, setMissionStatus] = useState([]);
  const [gameStats, setGameStats] = useState({
    hintsUsed: 0,
    puzzlesSkipped: 0,
    puzzlesSolved: 0,
    totalScore: 0
  });
  
  const timer = useTimer();

  // Initialize first puzzle
  useEffect(() => {
    if (gameState === 'waiting' && puzzleQueue.length === 0) {
      startGame();
    }
  }, [gameState, puzzleQueue.length]);

  const generatePuzzleBatch = (difficultyLevel, batchSize = 6) => {
    const newPuzzles = [];
    for (let i = 0; i < batchSize; i++) {
      const cipherType = CIPHER_TYPES[Math.floor(Math.random() * CIPHER_TYPES.length)];
      const generator = CIPHER_GENERATORS[cipherType];
      const puzzle = generator(WORD_BANK, difficultyLevel);
      newPuzzles.push(puzzle);
    }
    return newPuzzles;
  };

  const startGame = () => {
    const initialPuzzles = generatePuzzleBatch(1, 6);
    setPuzzleQueue(initialPuzzles);
    setCurrentPuzzleIndex(0);
    setCurrentDifficultyLevel(1);
    setGameState('playing');
    setMissionStatus([]);
    setGameStats({
      hintsUsed: 0,
      puzzlesSkipped: 0,
      puzzlesSolved: 0,
      totalScore: 0
    });
    timer.reset();
    timer.start();
    setCurrentPuzzle(initialPuzzles[0]);
    
    // Set mission for first puzzle
    const mission = getMissionForPuzzle(0);
    setCurrentMission(mission);
  };

  const generateNextPuzzle = (puzzleIndex) => {
    // Check if we need to generate more puzzles
    if (puzzleIndex >= puzzleQueue.length - 1) {
      const newBatch = generatePuzzleBatch(currentDifficultyLevel, 3);
      setPuzzleQueue(prev => [...prev, ...newBatch]);
    }
    
    // Check if game should end (after completing enough puzzles)
    if (puzzleIndex >= 15) { // End after 15 puzzles instead of fixed 3
      completeGame();
      return;
    }
    
    const nextPuzzle = puzzleQueue[puzzleIndex];
    if (nextPuzzle) {
      setCurrentPuzzle(nextPuzzle);
      
      // Set mission based on puzzle index (cycle through missions)
      const missionIndex = puzzleIndex % 3;
      const mission = getMissionForPuzzle(missionIndex);
      setCurrentMission(mission);
      
      // Show mission briefing for new mission types
      if (mission && puzzleIndex > 0 && puzzleIndex % 5 === 0) {
        setShowMissionBriefing(true);
      }
      
      setShowHint(false);
      setFeedback({ isCorrect: false, isIncorrect: false });
      
      // Set atmospheric message
      if (puzzleIndex > 0) {
        setAtmosphericMessage(getRandomAtmosphericMessage('progress'));
      }
    }
  };

  const calculateScore = () => {
    const basePointsPerPuzzle = 1000;
    const speedBonusThreshold = 120; // 2 minutes per puzzle
    const hintPenalty = 100;
    const skipPenalty = 500;
    
    let totalScore = 0;
    
    // Base points for solved puzzles
    totalScore += gameStats.puzzlesSolved * basePointsPerPuzzle;
    
    // Speed bonus calculation
    const averageTimePerPuzzle = timer.seconds / currentPuzzleIndex;
    if (averageTimePerPuzzle < speedBonusThreshold) {
      const speedBonus = Math.floor((speedBonusThreshold - averageTimePerPuzzle) * 10);
      totalScore += speedBonus;
    }
    
    // Time bonus for overall completion
    const maxTime = 900; // 15 minutes
    if (timer.seconds < maxTime) {
      const timeBonus = Math.floor((maxTime - timer.seconds) * 2);
      totalScore += timeBonus;
    }
    
    // Penalties
    totalScore -= gameStats.hintsUsed * hintPenalty;
    totalScore -= gameStats.puzzlesSkipped * skipPenalty;
    
    // Ensure minimum score of 0
    return Math.max(0, totalScore);
  };

  const completeGame = () => {
    timer.stop();
    const finalScore = calculateScore();
    setGameStats(prev => ({ ...prev, totalScore: finalScore }));
    setGameState('completed');
    setShowMissionComplete(true);
    setAtmosphericMessage('MISSION ACCOMPLISHED - ALL OBJECTIVES COMPLETE');
  };

  const handleSubmit = (answer) => {
    if (!currentPuzzle) return;

    const isCorrect = answer === currentPuzzle.answer;
    
    if (isCorrect) {
      setFeedback({ isCorrect: true, isIncorrect: false });
      setGameStats(prev => ({ ...prev, puzzlesSolved: prev.puzzlesSolved + 1 }));
      
      setMissionStatus(prev => {
        const newStatus = [...prev];
        newStatus[currentPuzzleIndex] = 'COMPLETE';
        return newStatus;
      });
      
      // Adaptive difficulty: increase difficulty if solved quickly without hints
      const puzzleStartTime = timer.seconds - (currentPuzzleIndex * 120); // Rough estimate
      if (puzzleStartTime < 60 && !showHint && currentDifficultyLevel < 5) {
        setCurrentDifficultyLevel(prev => Math.min(prev + 1, 5));
        setAtmosphericMessage(`Difficulty increased - Agent performance exceeds expectations`);
      }
      
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
    setGameStats(prev => ({ ...prev, puzzlesSkipped: prev.puzzlesSkipped + 1 }));
    
    // Adaptive difficulty: decrease difficulty when skipping
    if (currentDifficultyLevel > 1) {
      setCurrentDifficultyLevel(prev => Math.max(prev - 1, 1));
      setAtmosphericMessage('Difficulty adjusted - Providing tactical support');
    }
    
    setMissionStatus(prev => {
      const newStatus = [...prev];
      newStatus[currentPuzzleIndex] = 'BYPASSED';
      return newStatus;
    });
    
    if (currentDifficultyLevel === 1) {
      setAtmosphericMessage('Security layer bypassed - proceeding to next objective...');
    }
    
    const nextIndex = currentPuzzleIndex + 1;
    setCurrentPuzzleIndex(nextIndex);
    generateNextPuzzle(nextIndex);
  };

  const handleHint = () => {
    setGameStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
    setShowHint(true);
  };

  const handleSaveScore = () => {
    const finalPlayerName = playerName.trim() || 'Anonymous';
    saveScore(finalPlayerName, timer.seconds, currentPuzzleIndex, gameStats.totalScore, gameStats);
    setShowNameInput(false);
    setShowMissionComplete(false);
    
    // Show completion message
    setTimeout(() => {
      if (window.confirm('Game completed! Play again?')) {
        restartGame();
      }
    }, 100);
  };

  const restartGame = () => {
    setCurrentPuzzleIndex(0);
    setCurrentPuzzle(null);
    setPuzzleQueue([]);
    setCurrentDifficultyLevel(1);
    setGameState('waiting');
    setShowHint(false);
    setFeedback({ isCorrect: false, isIncorrect: false });
    setPlayerName('');
    setShowNameInput(false);
    setCurrentMission(null);
    setShowMissionBriefing(false);
    setAtmosphericMessage('');
    setShowMissionComplete(false);
    setMissionStatus([]);
    setGameStats({
      hintsUsed: 0,
      puzzlesSkipped: 0,
      puzzlesSolved: 0,
      totalScore: 0
    });
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
                  <span>Infiltrate Digital Facility (Multiple Security Layers)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Decode Encrypted Intelligence (Adaptive Difficulty)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Complete Deep Infiltration Mission</span>
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

  if (showMissionComplete) {
    const performanceRating = timer.seconds < 300 ? 'EXCEPTIONAL' : 
                             timer.seconds < 600 ? 'EXCELLENT' : 
                             timer.seconds < 900 ? 'GOOD' : 'COMPLETED';
    
    const performanceColor = timer.seconds < 300 ? 'from-yellow-400 to-orange-500' :
                            timer.seconds < 600 ? 'from-green-400 to-blue-500' :
                            timer.seconds < 900 ? 'from-cyan-400 to-blue-500' : 'from-gray-400 to-gray-600';

    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-black font-bold text-3xl">✓</span>
                </div>
                <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  MISSION ACCOMPLISHED
                </h2>
                <p className="text-green-400 text-lg font-medium">Operation: Digital Infiltration - SUCCESS</p>
              </div>

              <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">MISSION SUMMARY</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">{currentPuzzleIndex}</div>
                    <div className="text-sm text-gray-400">Security Layers</div>
                    <div className="text-sm text-gray-400">Breached</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400 mb-1">{timer.formattedTime}</div>
                    <div className="text-sm text-gray-400">Total Mission</div>
                    <div className="text-sm text-gray-400">Duration</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-4">
                    <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${performanceColor} bg-clip-text text-transparent`}>
                      {performanceRating}
                    </div>
                    <div className="text-sm text-gray-400">Performance</div>
                    <div className="text-sm text-gray-400">Rating</div>
                  </div>
                </div>
                
                <div className="mt-4 bg-[rgba(255,255,255,0.03)] rounded-lg p-4">
                  <h4 className="text-lg font-bold text-yellow-400 mb-3 text-center">MISSION SCORE</h4>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {gameStats.totalScore.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Total Points</div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
                    <div>
                      <div className="text-green-400 font-bold">{gameStats.puzzlesSolved}</div>
                      <div className="text-gray-500">Solved</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-bold">{gameStats.puzzlesSkipped}</div>
                      <div className="text-gray-500">Skipped</div>
                    </div>
                    <div>
                      <div className="text-orange-400 font-bold">{gameStats.hintsUsed}</div>
                      <div className="text-gray-500">Hints</div>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-bold">{Math.floor(timer.seconds / 60)}m {timer.seconds % 60}s</div>
                      <div className="text-gray-500">Time</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-cyan-400 mb-3">OBJECTIVES COMPLETED:</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>✓ Security Checkpoint Alpha Breached</span>
                    <span className={missionStatus[0] === 'BYPASSED' ? 'text-yellow-400' : 'text-green-400'}>
                      {missionStatus[0] || 'COMPLETE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✓ Central Database Accessed</span>
                    <span className={missionStatus[1] === 'BYPASSED' ? 'text-yellow-400' : 'text-green-400'}>
                      {missionStatus[1] || 'COMPLETE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✓ Vault Protocol Override Successful</span>
                    <span className={missionStatus[2] === 'BYPASSED' ? 'text-yellow-400' : 'text-green-400'}>
                      {missionStatus[2] || 'COMPLETE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✓ All Encrypted Intelligence Acquired</span>
                    <span className="text-green-400">MISSION COMPLETE</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Outstanding work, Agent Cipher! You have successfully infiltrated the secure digital facility 
                  and decoded all encrypted intelligence. The mission is complete and extraction is confirmed.
                </p>
              </div>
              
              <button
                onClick={() => {
                  setShowMissionComplete(false);
                  setShowNameInput(true);
                }}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-105"
              >
                Record Achievement
              </button>
            </div>
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
            <div className="mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-black font-bold text-xl">🏆</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Achievement Unlocked
              </h2>
            </div>
            <p className="text-gray-300 mb-6">
              Secure your place in the Agent Hall of Fame
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Agent Codename:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter codename (optional)"
                autoComplete="off"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveScore()}
              />
            </div>
            
            <button
              onClick={handleSaveScore}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 transform hover:scale-105"
            >
              Submit to Hall of Fame
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