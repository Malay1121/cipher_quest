// LocalStorage utilities for leaderboard
const LEADERBOARD_KEY = 'cipherquest_leaderboard';

export function getLeaderboard() {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    return [];
  }
}

export function saveScore(playerName, timeInSeconds, roomsCompleted) {
  try {
    const leaderboard = getLeaderboard();
    const newScore = {
      id: Date.now(),
      playerName: playerName || 'Anonymous',
      time: timeInSeconds,
      rooms: roomsCompleted,
      date: new Date().toISOString()
    };

    leaderboard.push(newScore);
    
    // Sort by rooms completed (desc), then by time (asc)
    leaderboard.sort((a, b) => {
      if (b.rooms !== a.rooms) {
        return b.rooms - a.rooms;
      }
      return a.time - b.time;
    });

    // Keep only top 10 scores
    const topScores = leaderboard.slice(0, 10);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topScores));
    
    return topScores;
  } catch (error) {
    console.error('Error saving score:', error);
    return getLeaderboard();
  }
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
  }
}