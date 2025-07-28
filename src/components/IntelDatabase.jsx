import React, { useState } from 'react';
import { X, Database, Shield, Book, Target, History, Zap, Brain, Lock, Key, Eye, AlertTriangle } from 'lucide-react';

const IntelDatabase = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const cipherData = {
    caesar: {
      name: 'Caesar Cipher',
      classification: 'BASIC SUBSTITUTION',
      difficulty: 'NOVICE',
      icon: <Shield className="w-5 h-5" />,
      description: 'A simple substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.',
      history: 'Named after Julius Caesar, who used it to protect military communications around 50 BC. Caesar typically used a shift of 3, making A become D, B become E, and so on.',
      howItWorks: 'Each letter in the plaintext is replaced by a letter a fixed number of positions down the alphabet. For example, with a shift of 3: A→D, B→E, C→F.',
      strengths: ['Simple to implement', 'Fast encryption/decryption', 'No key distribution needed'],
      weaknesses: ['Only 25 possible keys', 'Vulnerable to frequency analysis', 'Easily broken by brute force'],
      attackMethods: [
        'Brute Force: Try all 25 possible shifts',
        'Frequency Analysis: Look for common letter patterns',
        'Known Plaintext: If you know part of the message'
      ],
      tips: [
        'Look for single-letter words (likely A or I)',
        'Check for common three-letter words (THE, AND)',
        'Use frequency analysis - E is most common in English'
      ]
    },
    vigenere: {
      name: 'Vigenère Cipher',
      classification: 'POLYALPHABETIC SUBSTITUTION',
      difficulty: 'INTERMEDIATE',
      icon: <Key className="w-5 h-5" />,
      description: 'A polyalphabetic cipher that uses a keyword to create multiple Caesar ciphers, making it much stronger than simple substitution.',
      history: 'Described by Giovan Battista Bellaso in 1553, but misattributed to Blaise de Vigenère. Called "le chiffre indéchiffrable" (the indecipherable cipher) for 300 years.',
      howItWorks: 'Uses a repeating keyword where each letter determines the shift for that position. If the keyword is "KEY" and plaintext is "HELLO", K shifts H, E shifts E, Y shifts L, then repeat.',
      strengths: ['Resists simple frequency analysis', 'Multiple substitution alphabets', 'Keyword can be any length'],
      weaknesses: ['Keyword repetition creates patterns', 'Vulnerable to Kasiski examination', 'Known plaintext attacks possible'],
      attackMethods: [
        'Kasiski Examination: Find repeating patterns to determine key length',
        'Index of Coincidence: Statistical method to find key length',
        'Frequency Analysis: Once key length is known, treat as multiple Caesar ciphers'
      ],
      tips: [
        'Look for repeating sequences in the ciphertext',
        'Calculate distances between repetitions',
        'Find common factors to determine keyword length',
        'Use frequency analysis on each position'
      ]
    },
    symbol: {
      name: 'Symbol Substitution',
      classification: 'MONOALPHABETIC SUBSTITUTION',
      difficulty: 'ADVANCED',
      icon: <Eye className="w-5 h-5" />,
      description: 'Each letter of the alphabet is replaced with a unique symbol, creating a one-to-one mapping that obscures the original text.',
      history: 'Used throughout history in various forms, from ancient Egyptian hieroglyphs to modern cryptographic puzzles. Popular in treasure hunts and escape rooms.',
      howItWorks: 'A direct substitution where each letter maps to a specific symbol. Unlike Caesar cipher, the mapping is not based on shifting but on a predetermined symbol alphabet.',
      strengths: ['Visually obscures the message completely', 'Can use any symbols or characters', 'Immune to shift-based attacks'],
      weaknesses: ['Vulnerable to frequency analysis', 'Pattern recognition can reveal structure', 'Single-letter words are obvious'],
      attackMethods: [
        'Frequency Analysis: Most common symbol likely represents E or T',
        'Pattern Recognition: Look for repeated symbol groups',
        'Word Structure: Single symbols are A or I, common patterns are THE, AND'
      ],
      tips: [
        'Count symbol frequency - start with most common',
        'Look for single-symbol words (A or I)',
        'Find three-symbol patterns (THE, AND, FOR)',
        'Use word boundaries and punctuation as clues'
      ]
    }
  };

  const loreData = {
    facility: {
      name: 'The Nexus Facility',
      classification: 'TOP SECRET',
      description: 'A state-of-the-art digital intelligence facility housing the world\'s most sensitive encrypted data. Three security layers protect the core vault.',
      levels: [
        {
          name: 'Security Checkpoint Alpha',
          description: 'The outer perimeter uses basic Caesar encryption for initial access control. Designed to filter out casual intruders.',
          security: 'BASIC'
        },
        {
          name: 'Central Database Core',
          description: 'The main intelligence repository protected by military-grade Vigenère encryption. Contains classified operational data.',
          security: 'ADVANCED'
        },
        {
          name: 'High-Security Vault',
          description: 'The innermost sanctum using ancient symbol substitution methods. Houses the facility\'s most guarded secrets.',
          security: 'MAXIMUM'
        }
      ]
    },
    agent: {
      name: 'Agent Cipher',
      codename: 'CIPHER',
      classification: 'CRYPTANALYST OPERATIVE',
      background: 'Elite intelligence operative specializing in cryptographic infiltration and code-breaking operations.',
      skills: [
        'Advanced Cryptanalysis',
        'Digital Infiltration',
        'Pattern Recognition',
        'Frequency Analysis',
        'Rapid Decryption'
      ],
      missions: 'Over 50 successful digital infiltrations across 12 countries. Specialist in breaking enemy encryption protocols.'
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Database className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Intelligence Database
        </h3>
        <p className="text-gray-400">
          Classified information on cryptographic systems and operational intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Cipher Systems</h4>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            Detailed analysis of encryption methods used in the field
          </p>
          <div className="space-y-2">
            {Object.entries(cipherData).map(([key, cipher]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{cipher.name}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  cipher.difficulty === 'NOVICE' ? 'bg-green-500/20 text-green-400' :
                  cipher.difficulty === 'INTERMEDIATE' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {cipher.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Operational Intel</h4>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            Background information on current mission parameters
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Target Facility</span>
              <span className="text-cyan-400">Nexus Complex</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Security Layers</span>
              <span className="text-cyan-400">3 Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Threat Level</span>
              <span className="text-red-400">MAXIMUM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCiphers = () => (
    <div className="space-y-6">
      {Object.entries(cipherData).map(([key, cipher]) => (
        <div key={key} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            {cipher.icon}
            <div>
              <h3 className="text-xl font-bold text-white">{cipher.name}</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-cyan-400">{cipher.classification}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  cipher.difficulty === 'NOVICE' ? 'bg-green-500/20 text-green-400' :
                  cipher.difficulty === 'INTERMEDIATE' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {cipher.difficulty}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-4">{cipher.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2 flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>Historical Background</span>
              </h4>
              <p className="text-gray-400 text-sm mb-4">{cipher.history}</p>

              <h4 className="font-semibold text-cyan-400 mb-2 flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>How It Works</span>
              </h4>
              <p className="text-gray-400 text-sm">{cipher.howItWorks}</p>
            </div>

            <div>
              <h4 className="font-semibold text-green-400 mb-2">Strengths</h4>
              <ul className="text-gray-400 text-sm space-y-1 mb-4">
                {cipher.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold text-red-400 mb-2">Weaknesses</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                {cipher.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Attack Methods</span>
                </h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  {cipher.attackMethods.map((method, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-yellow-400 mt-1">▸</span>
                      <span>{method}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-cyan-400 mb-2 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Decryption Tips</span>
                </h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  {cipher.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-cyan-400 mt-1">▸</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLore = () => (
    <div className="space-y-6">
      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-xl font-bold text-white">{loreData.facility.name}</h3>
            <span className="text-red-400 text-sm font-medium">{loreData.facility.classification}</span>
          </div>
        </div>

        <p className="text-gray-300 mb-6">{loreData.facility.description}</p>

        <h4 className="font-semibold text-cyan-400 mb-4">Security Architecture</h4>
        <div className="space-y-4">
          {loreData.facility.levels.map((level, index) => (
            <div key={index} className="bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-white">{level.name}</h5>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  level.security === 'BASIC' ? 'bg-green-500/20 text-green-400' :
                  level.security === 'ADVANCED' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {level.security}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{level.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-xl font-bold text-white">{loreData.agent.name}</h3>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-cyan-400">Codename: {loreData.agent.codename}</span>
              <span className="text-yellow-400">{loreData.agent.classification}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 mb-4">{loreData.agent.background}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Specialized Skills</h4>
            <div className="space-y-2">
              {loreData.agent.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Mission Record</h4>
            <p className="text-gray-400 text-sm">{loreData.agent.missions}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Database className="w-4 h-4" /> },
    { id: 'ciphers', label: 'Cipher Analysis', icon: <Lock className="w-4 h-4" /> },
    { id: 'lore', label: 'Mission Intel', icon: <Book className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[rgba(14,14,14,0.95)] border border-[rgba(255,255,255,0.15)] backdrop-blur-md rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Intel Database
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-[rgba(255,255,255,0.1)]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-[rgba(6,182,212,0.1)]'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'ciphers' && renderCiphers()}
          {activeTab === 'lore' && renderLore()}
        </div>
      </div>
    </div>
  );
};

export default IntelDatabase;