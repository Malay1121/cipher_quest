// Narrative and mission system for CipherQuest
export const GAME_NARRATIVE = {
  backstory: {
    title: "Operation: Digital Infiltration",
    description: "You are Agent Cipher, infiltrating a secure digital facility. Each room contains encrypted intelligence that must be decoded to progress deeper into the system.",
    objective: "Decode all encrypted files and escape before the security protocols activate."
  },
  
  missions: [
    {
      id: 'caesar',
      title: "Security Checkpoint Alpha",
      briefing: "You've breached the outer perimeter. The first security door requires a basic Caesar cipher key to unlock.",
      objective: "Decode the access code using classical shift cipher techniques",
      location: "Entrance Security Terminal",
      urgency: "low",
      flavorText: "The terminal hums quietly, displaying scrambled text. This looks like a simple substitution..."
    },
    {
      id: 'vigenere',
      title: "Central Database Access",
      briefing: "Excellent work, Agent. You're now in the main facility. The central database uses military-grade Vigenère encryption.",
      objective: "Break the polyalphabetic cipher to access classified files",
      location: "Central Command Center",
      urgency: "medium",
      flavorText: "Multiple screens flicker with encrypted data. The pattern suggests a keyword-based cipher system..."
    },
    {
      id: 'symbol',
      title: "Vault Protocol Override",
      briefing: "Final stage, Agent Cipher. The vault's security system uses an ancient symbol substitution cipher. Time is running out.",
      objective: "Decipher the symbolic code to complete your mission",
      location: "High-Security Vault",
      urgency: "high",
      flavorText: "Strange symbols glow on the vault door. Each symbol must correspond to a letter. The facility's alarms grow louder..."
    }
  ],

  completionMessages: [
    {
      type: 'success',
      title: "Security Breach Successful",
      message: "Outstanding work, Agent Cipher! The first barrier has been bypassed.",
      nextAction: "Proceeding to next security layer..."
    },
    {
      type: 'success', 
      title: "Database Compromised",
      message: "Excellent! The central database has been accessed. Critical intelligence acquired.",
      nextAction: "Moving to final objective..."
    },
    {
      type: 'mission_complete',
      title: "Mission Accomplished",
      message: "Incredible work, Agent Cipher! All encrypted files have been successfully decoded. The facility's secrets are now in your hands.",
      nextAction: "Extraction complete. Well done, Agent."
    }
  ],

  hints: [
    {
      type: 'caesar',
      messages: [
        "Agent, try analyzing letter frequency patterns...",
        "The shift appears to be consistent across all letters.",
        "Remember: A becomes B with a shift of 1, B becomes C, and so on."
      ]
    },
    {
      type: 'vigenere', 
      messages: [
        "Look for repeating patterns in the ciphertext, Agent.",
        "The keyword length might be revealed by pattern distances.",
        "Once you find the keyword length, treat it as multiple Caesar ciphers."
      ]
    },
    {
      type: 'symbol',
      messages: [
        "Frequency analysis is your friend here, Agent.",
        "The most common symbol likely represents 'E' or 'T'.",
        "Look for single-symbol words - they're probably 'A' or 'I'."
      ]
    }
  ],

  atmosphericElements: {
    timeWarnings: [
      "Security protocols activating in T-minus 10 minutes...",
      "Warning: Unauthorized access detected. Lockdown imminent.",
      "Alert: Facility security has been compromised. Initiating countermeasures.",
      "Critical: Multiple security breaches detected. Emergency protocols engaged."
    ],
    
    progressMessages: [
      "Access granted. Moving deeper into the facility...",
      "Security layer bypassed. Excellent work, Agent.",
      "Cipher decoded successfully. Intelligence acquired.",
      "System breach confirmed. Proceeding to next objective."
    ]
  }
};

export function getMissionForPuzzle(puzzleIndex) {
  return GAME_NARRATIVE.missions[puzzleIndex] || null;
}

export function getCompletionMessage(puzzleIndex) {
  return GAME_NARRATIVE.completionMessages[puzzleIndex] || null;
}

export function getHintForPuzzleType(puzzleType) {
  const hintSet = GAME_NARRATIVE.hints.find(h => h.type === puzzleType);
  if (hintSet && hintSet.messages.length > 0) {
    return hintSet.messages[Math.floor(Math.random() * hintSet.messages.length)];
  }
  return "Analyze the pattern carefully, Agent.";
}

export function getRandomAtmosphericMessage(type = 'progress') {
  const messages = GAME_NARRATIVE.atmosphericElements[type === 'warning' ? 'timeWarnings' : 'progressMessages'];
  return messages[Math.floor(Math.random() * messages.length)];
}