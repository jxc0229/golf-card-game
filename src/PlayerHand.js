// src/PlayerHand.js
import React from 'react';
import Card from './Card';

const PlayerHand = ({ hand, playerNumber, revealCard }) => {
  return (
    <div className="player-hand">
      <h2>Player {playerNumber}</h2>
      <div className="card-grid">
        {hand.map((card, index) => (
          <Card
            key={index}
            card={card}
            isRevealed={card.revealed} // Pass revealed state to Card.js
            onReveal={() => revealCard(playerNumber, index)} // Pass reveal function 
            />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
