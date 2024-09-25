// src/Scoreboard.js
import React from 'react';

const Scoreboard = ({ player1Hand, player2Hand }) => {
  const calculateScore = (hand) => {
    return hand
      .filter((card) => card.revealed) // Only include revealed cards
      .reduce((total, card) => {
        if (card.value === 'KING') return total; // King is 0 points
        if (card.value === 'QUEEN' || card.value === 'JACK') return total + 10; // Jacks/Queens are 10 points
        return total + (parseInt(card.value) || 0); // Add face value of other cards (Ace is 1, number cards add their value)
      }, 0);
  };

  return (
    <div className="scoreboard">
      <h3>Scores</h3>
      <p>Player 1: {calculateScore(player1Hand)} points</p>
      <p>Player 2: {calculateScore(player2Hand)} points</p>
    </div>
  );
};

export default Scoreboard;
