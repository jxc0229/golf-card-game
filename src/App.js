// src/App.js
import React, { useState, useEffect } from 'react';
import PlayerHand from './PlayerHand';
import Deck from './Deck';
import Scoreboard from './Scoreboard';
import './App.css';
import Rules from './Rules';

const App = () => {
  const [deckId, setDeckId] = useState(null);
  const [drawPile, setDrawPile] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [player1Hand, setPlayer1Hand] = useState([]);
  const [player2Hand, setPlayer2Hand] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  // Fetch a shuffled deck from the API when the app starts
  useEffect(() => {
    const fetchDeck = async () => {
      const response = await fetch(
        'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
      );
      const data = await response.json();
      setDeckId(data.deck_id); // Save the deck ID for future API calls
      drawInitialHands(data.deck_id); // Deal initial hands to both players
    };

    fetchDeck();
  }, []);

  // Function to draw the initial 6 cards for each player
  const drawInitialHands = async (deckId) => {
    const player1Response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`
    );
    const player2Response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`
    );

    const player1Cards = await player1Response.json();
    const player2Cards = await player2Response.json();

    setPlayer1Hand(player1Cards.cards.map(card => ({ ...card, revealed: false })));
    setPlayer2Hand(player2Cards.cards.map(card => ({ ...card, revealed: false })));

    // Draw 1 card for the discard pile
    const discardResponse = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
    );
    const discardCard = await discardResponse.json();
    setDiscardPile(discardCard.cards);
  };

  const revealCard = (playerNumber, cardIndex) => {
    if (playerNumber === 1) {
      setPlayer1Hand(prevHand =>
        prevHand.map((card, index) =>
          index === cardIndex ? { ...card, revealed: true } : card
        )
      );
    } else if (playerNumber === 2) {
      setPlayer2Hand(prevHand =>
        prevHand.map((card, index) =>
          index === cardIndex ? { ...card, revealed: true } : card
        )
      );
    }
  };

  const drawCard = async () => {
    if (deckId) {
      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const data = await response.json();

      if (data.cards.length > 0) {
        setDrawPile([data.cards[0]]); // Update the draw pile to show the drawn card
      }
    }
  };


  return (
    <div className="App">
      <h1>Golf Card Game</h1>
      <Scoreboard player1Hand={player1Hand} player2Hand={player2Hand} />
      <div className="game-board">
        <PlayerHand hand={player1Hand} playerNumber={1} revealCard={revealCard} />
        <Deck deckId={deckId} discardPile={discardPile} drawPile={drawPile}
          drawCard={drawCard} />
        <PlayerHand hand={player2Hand} playerNumber={2} revealCard={revealCard} />
      </div>
      <Rules />
    </div>
  );
};

export default App;
