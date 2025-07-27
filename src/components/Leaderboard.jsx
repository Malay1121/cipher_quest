import React, { useState } from 'react';
import { X, Trophy, Clock, Target, Calendar, Trash2 } from 'lucide-react';
import { getLeaderboard, clearLeaderboard } from '../utils/storage';

const Leaderboard = ({ isOpen, onClose }) => {
  const [scores] = useState(() => getLeaderboard());

  const handleClearLeaderboard = () => {
    if (window.confirm('Are you sure you want to clear all leaderboard data?')) {
      clearLeaderboard();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[rgba(14,14,14,0.95)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Leaderboard
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {scores.length > 0 && (
              <button
                onClick={handleClearLeaderboard}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-[rgba(255,107,107,0.1)] rounded-lg transition-all duration-200"
                title="Clear Leaderboard"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {scores.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No scores yet!</p>
              <p className="text-gray-500 text-sm mt-2">
                Complete your first game to see your score here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/30'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-600/10 to-orange-700/10 border-orange-600/30'
                      : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? 'bg-yellow-500 text-black'
                          : index === 1
                          ? 'bg-gray-400 text-black'
                          : index === 2
                          ? 'bg-orange-600 text-white'
                          : 'bg-[rgba(255,255,255,0.1)] text-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {score.playerName}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Target className="w-3 h-3" />
                            <span>{score.rooms} rooms</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(score.time)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(score.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;