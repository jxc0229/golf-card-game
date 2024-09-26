// src/PlayerHand.js
import React from 'react';
import Card from './Card';

const PlayerHand = ({ hand, playerNumber, currentPlayer, replaceCardInHand, hasDrawnCard, takeDiscardCard }) => {
  const handleClick = (index) => {
    if (currentPlayer !== playerNumber) return; // Only allow if it's the player's turn
    if (!hasDrawnCard) {
      // If the player hasn't drawn a card, automatically take the discard card
      takeDiscardCard(playerNumber, index); // This sets the discard card as the drawn card
    }

    replaceCardInHand(playerNumber, index); // Proceed with replacing the card in hand
  };


  return (
    <div className={`player-hand ${currentPlayer === playerNumber ? 'active' : 'inactive'}`}>
      <h2>Player {playerNumber}</h2>
      <div className="card-grid">
        {hand.map((card, index) => (
          <Card
            key={index}
            card={card}
            isRevealed={card.revealed} // Pass revealed state to Card.js
            onClick={() => handleClick(index)} // Replace the card when clicked
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
