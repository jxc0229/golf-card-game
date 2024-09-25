// src/Deck.js
import React from 'react';
import Card from './Card';


const Deck = ({ deckId, discardPile, drawPile, drawCard }) => {



  return (
    <div className="deck">
      {/* <div className="draw-pile">
        <h3>Remaining deck</h3>
        <img
          src={"https://www.deckofcardsapi.com/static/img/back.png"}
          alt={`Back of a card`}
        />
      </div> */}
      <div className="draw-pile" onClick={drawCard}>
        <h3>Remaining deck</h3>
        {drawPile.length > 0 ? (
          <img
            src={drawPile[0].image} // Show the drawn card face-up
            alt={`${drawPile[0].value} of ${drawPile[0].suit}`}
          />
        ) : (
          <img
            src="https://deckofcardsapi.com/static/img/back.png"  // Back of the card (default)
            alt="Card back"
          />
        )}
      </div>
      <div className="discard-pile">
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
