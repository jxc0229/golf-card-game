// src/Scoreboard.js
import React from 'react';

const Scoreboard = ({ player1Hand, player2Hand }) => {
  const calculateScore = (hand) => {
    if (!hand || hand.length === 0) {
      // If the hand is not yet populated, return 0 or a placeholder value
      return 0;
    }

    const grid = [
      [hand[0], hand[1], hand[2]],  // Row 1
      [hand[3], hand[4], hand[5]],  // Row 2
    ];

    let score = 0;

    const getCardValue = (card) => {
      if (!card.revealed) return 0; // Only consider revealed cards
      if (card.value === '2') return -2; // Rule 1: Card value is -2 for '2'
      if (card.value === 'KING') return 0; // King is 0 points
      if (card.value === 'QUEEN' || card.value === 'JACK') return 10; // Jack/Queen = 10 points
      return parseInt(card.value) || 0; // Number cards = face value, Ace = 1
    };

    for (let i = 0; i < 6; i++) {
      score += getCardValue(hand[i])
    }

    // Helper function to check if all cards in an array are the same
    const allCardsMatch = (cards) => {
      if (cards.every(card => card.revealed)) {
        return cards.every(card => card.value === cards[0].value);
      }
      return false;
    };


    // Rule 2: Column matching (0 points for matching columns)
    for (let col = 0; col < 3; col++) {
      const column = [grid[0][col], grid[1][col]]; // Cards in the same column
      if (allCardsMatch(column)) {
        score -= getCardValue(column[0]) + getCardValue(column[1]);
      }
    }


    // Rule 3: Row matching (0 points for matching rows)
    for (let row = 0; row < 2; row++) {
      if (allCardsMatch(grid[row])) {
        score -= getCardValue(grid[row][0]) + getCardValue(grid[row][1]) + getCardValue(grid[row][2]);
      }

    }


    // Rule 4: 2x2 Grid matching (-20 points if 2x2 grid matches)
    const grid2x2 = [
      [grid[0][0], grid[0][1], grid[1][0], grid[1][1]],
      [grid[0][1], grid[0][2], grid[1][1], grid[1][2]],
    ];
    for (let i = 0; i < grid2x2.length; i++) {
      if (allCardsMatch(grid2x2[i])) {
        score -= 20; // Subtract 20 points if a 2x2 grid has the same card
      }
    }


    return score;
  };





  // return hand
  //   .filter((card) => card.revealed) // Only include revealed cards
  //   .reduce((total, card) => {
  //     if (card.value === 'KING') return total; // King is 0 points
  //     if (card.value === 'QUEEN' || card.value === 'JACK') return total + 10; // Jacks/Queens are 10 points
  //     return total + (parseInt(card.value) || 0); // Add face value of other cards (Ace is 1, number cards add their value)
  //   }, 0);

  return (
    <div className="scoreboard">
      <h3>Scores</h3>
      <p>Player 1: {calculateScore(player1Hand)} points</p>
      <p>Player 2: {calculateScore(player2Hand)} points</p>
    </div>
  );
};

export default Scoreboard;
