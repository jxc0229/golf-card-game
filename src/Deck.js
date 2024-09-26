// src/Deck.js
import React from 'react';
import Card from './Card';


const Deck = ({ discardPile, drawnCard, drawCard, discardCard }) => {



  return (
    <div className="deck">
      <div className="draw-pile" onClick={drawCard}>
        <h3>Remaining deck</h3>
        {drawnCard ? (
          <img
            src={drawnCard.image} // Show the drawn card face-up
            alt={`${drawnCard.value} of ${drawnCard.suit}`}
          />
        ) : (
          <img
            src="https://deckofcardsapi.com/static/img/back.png"  // Back of the card (default)
            alt="Card back"
          />
        )}
      </div>
      <div className="discard-pile" onClick={discardCard}>
        <h3>Discard Pile</h3>
        {discardPile.length > 0 ? (
          <div>
            <img
              src={discardPile[0].image}
              alt={`${discardPile[0].value} of ${discardPile[0].suit}`}
            />
          </div>
        ) : (
          <p>No cards in the discard pile</p>
        )}
      </div>
    </div>
  );
};

export default Deck;
