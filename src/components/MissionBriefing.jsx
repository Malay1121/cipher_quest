import React from 'react';
import { Shield, Target, MapPin, Clock, AlertTriangle } from 'lucide-react';

const MissionBriefing = ({ mission, isVisible, onClose }) => {
  if (!mission || !isVisible) return null;

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'low': return 'text-green-400 border-green-500/30 bg-green-500/10';
      default: return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <Shield className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-[rgba(14,14,14,0.95)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-xl max-w-lg w-full p-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <span className="text-cyan-400 font-semibold text-sm">MISSION BRIEFING</span>
          </div>
          <div className={`px-2 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getUrgencyColor(mission.urgency)}`}>
            {getUrgencyIcon(mission.urgency)}
            <span>{mission.urgency?.toUpperCase()} PRIORITY</span>
          </div>
        </div>

        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
          {mission.title}
        </h2>

        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{mission.location}</span>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">SITUATION:</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {mission.briefing}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>OBJECTIVE:</span>
          </h3>
          <p className="text-cyan-300 text-sm font-medium">
            {mission.objective}
          </p>
        </div>

        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 mb-6">
          <p className="text-gray-400 text-xs italic">
            {mission.flavorText}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105"
        >
          Begin Mission
        </button>
      </div>
    </div>
  );
};

export default MissionBriefing;