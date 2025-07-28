import React from 'react';
import { Trophy, Database } from 'lucide-react';

const Header = ({ onShowLeaderboard, onShowIntelDatabase }) => {
  return (
    <header className="flex justify-between items-center p-6 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.1)]">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-sm">C</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          CipherQuest
        </h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onShowIntelDatabase}
          className="flex items-center space-x-2 px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.15)] rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-gray-300 text-sm font-medium">Intel Database</span>
        </button>
        
        <button
          onClick={onShowLeaderboard}
          className="flex items-center space-x-2 px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.15)] rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <Trophy className="w-4 h-4 text-cyan-400" />
          <span className="text-gray-300 text-sm font-medium">Leaderboard</span>
        </button>
      </div>
    </header>
  );
};

export default Header;