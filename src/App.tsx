import React, { useState } from 'react';
import Header from './components/Header';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import IntelDatabase from './components/IntelDatabase';
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/orbitron/900.css';

function App() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showIntelDatabase, setShowIntelDatabase] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0E0E0E] to-gray-900 text-gray-100 font-orbitron overflow-x-hidden">
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.3),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowIntelDatabase={() => setShowIntelDatabase(true)}
        />
        <Game />
      </div>

      <Leaderboard 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />

      <IntelDatabase 
        isOpen={showIntelDatabase} 
        onClose={() => setShowIntelDatabase(false)} 
      />

      <div className="fixed top-10 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      <div className="fixed bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2s"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse animation-delay-4s"></div>
    </div>
  );
}

export default App;