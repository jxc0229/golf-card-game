// src/Card.js
import React from 'react';

const Card = ({ card, isRevealed, onReveal }) => {
  return (
    <div className="card" onClick={onReveal}>
      {isRevealed ? (
        <div>
          <img src={card.image} alt={`${card.value} of ${card.suit}`} />
        </div>
      ) : (
        <div>
          <img
            src="https://deckofcardsapi.com/static/img/back.png"
            alt="Card back"
          />
        </div>
      )}
    </div>
  );
};

export default Card;
