// src/App.js
import React, { useState, useEffect } from 'react';
import PlayerHand from './PlayerHand';
import Deck from './Deck';
import { Scoreboard, calculateScore } from './Scoreboard';
import './App.css';
import Rules from './Rules';

const App = () => {
  const [deckId, setDeckId] = useState(null);
  const [drawPile, setDrawPile] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [player1Hand, setPlayer1Hand] = useState([]);
  const [player2Hand, setPlayer2Hand] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [drawnCard, setDrawnCard] = useState(null);
  const [hasDrawnCard, setHasDrawnCard] = useState(false);
  const [gameOverState, setGameOverState] = useState(false); // Track if the game is over and who revealed all cards first
  const [last, setLast] = useState(false);

  // Fetch a shuffled deck from the API when the app starts
  const fetchDeck = async () => {
    const response = await fetch(
      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    );
    const data = await response.json();
    setDeckId(data.deck_id); // Save the deck ID for future API calls
    drawInitialHands(data.deck_id); // Deal initial hands to both players
    revealTwoRandom(1);
    revealTwoRandom(2);
  };

  useEffect(() => {
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

  const revealTwoRandom = (playerNumber) => {
    const randomNumber1 = Math.floor(Math.random() * 6);

    // Generate the second random number and ensure it's different from the first
    let randomNumber2 = Math.floor(Math.random() * 6);
    while (randomNumber1 === randomNumber2) {
      randomNumber2 = Math.floor(Math.random() * 6);
    }

    revealCard(playerNumber, randomNumber1)
    revealCard(playerNumber, randomNumber2)
  };

  // Function to switch turns
  const switchTurn = () => {
    console.log(gameOverState)
    // If the game is over and the other player had their final turn, end the game
    if (gameOverState && last) {
      console.log(1)
      calculateWinner(); // End the game and declare the winner
    } else if (gameOverState) {
      console.log(2)
      // If the game is over and the other player hasn't had their final round, let them play
      setLast(true)
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Switch turns
    } else {
      console.log(3)
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Normal turn switch
    }
  };

  const calculateWinner = () => {
    const player1Score = calculateScore(player1Hand); // Assume calculateScore is a function that calculates a player's score
    const player2Score = calculateScore(player2Hand);

    if (player1Score < player2Score) {
      alert('Player 1 wins with a lower score!');
    } else if (player2Score < player1Score) {
      alert('Player 2 wins with a lower score!');
    } else {
      alert('It\'s a tie!');
    }

    setGameOverState(null); // Reset the game over state after declaring the winner
  };


  const revealCard = (playerNumber, cardIndex) => {
    if (playerNumber === 1) {
      const updatedHand = player1Hand.map((card, index) =>
        index === cardIndex ? { ...card, revealed: true } : card
      );
      setPlayer1Hand(updatedHand);
    } else if (playerNumber === 2) {
      const updatedHand = player2Hand.map((card, index) =>
        index === cardIndex ? { ...card, revealed: true } : card
      );
      setPlayer2Hand(updatedHand);
    }
  };

  const drawCard = async () => {
    if (deckId) {
      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      const data = await response.json();

      if (data.cards.length > 0) {
        setDrawnCard(data.cards[0]);
        setDrawPile([data.cards[0]]); // Update the draw pile to show the drawn card
        setHasDrawnCard(true);
      }
    }
  };

  // Function to replace a card in the player's hand with the drawn card
  const replaceCardInHand = (playerNumber, cardIndex) => {
    if (!drawnCard) return; // No card drawn, do nothing
    if (playerNumber !== currentPlayer) return;


    if (currentPlayer === 1) {
      const updatedHand = player1Hand.map((card, index) =>
        index === cardIndex ? { ...drawnCard, revealed: true } : card
      );
      const discardedCard = { ...player1Hand[cardIndex], revealed: true };
      setDiscardPile([discardedCard, ...discardPile]);
      setPlayer1Hand(updatedHand);

      if (hasRevealedAllCards(updatedHand)) {
        if (!gameOverState) {
          // console.log("hello??")
          setGameOverState(true);
          alert('Last round!');
        }
      }

    } else {
      const updatedHand = player2Hand.map((card, index) =>
        index === cardIndex ? { ...drawnCard, revealed: true } : card
      );
      const discardedCard = { ...player2Hand[cardIndex], revealed: true };
      setDiscardPile([discardedCard, ...discardPile]);
      setPlayer2Hand(updatedHand);

      if (hasRevealedAllCards(updatedHand)) {
        if (!gameOverState) {
          setGameOverState(true);
          alert('Last round!');
        }
      }
    }
    setDrawnCard(null);
    setHasDrawnCard(false);
    switchTurn();
  };

  // Function to discard the drawn card
  const discardCard = () => {
    if (!drawnCard) return; // No card drawn, do nothing

    // Simply add the drawn card to the discard pile
    const discardedCard = { ...drawnCard, revealed: true };
    setDiscardPile([discardedCard, ...discardPile]);
    setDrawnCard(null); // Clear the drawn card
    switchTurn(); // Switch to the next player's turn
  };

  const takeDiscardCard = (playerNumber, cardIndex) => {
    if (discardPile.length === 0) return; // No card in the discard pile
    const topDiscardCard = discardPile[0]; // Take the top card from the discard pile
    setDrawnCard(topDiscardCard); // Set the taken card as the drawn card for the player
    setDiscardPile(discardPile.slice(1)); // Remove the top card from the discard pile
    setHasDrawnCard(true); // Indicate that the player has drawn a card

  }

  const hasRevealedAllCards = (hand) => {
    return hand.every(card => card.revealed === true); // Check if all cards are revealed
  };

  const resetGame = () => {
    // Reset all relevant state variables
    setPlayer1Hand([]);
    setPlayer2Hand([]);
    setDiscardPile([]);
    setDrawnCard(null);
    setCurrentPlayer(1);
    setDeckId(null);

    // Optionally, re-fetch a new deck and deal new hands (if necessary)
    fetchDeck();  // Uncomment if you want to re-fetch a new deck after reset
  };

  return (
    <div className="App">
      <h1>Golf Card Game</h1>
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
      <Scoreboard player1Hand={player1Hand} player2Hand={player2Hand} />
      <div className="game-board">
        <PlayerHand
          hand={player1Hand}
          playerNumber={1}
          currentPlayer={currentPlayer}
          replaceCardInHand={replaceCardInHand}
          hasDrawnCard={hasDrawnCard}
          takeDiscardCard={takeDiscardCard}
        />
        <Deck drawnCard={drawnCard} discardPile={discardPile} drawCard={drawCard} discardCard={discardCard} />
        <PlayerHand
          hand={player2Hand}
          playerNumber={2}
          currentPlayer={currentPlayer}
          replaceCardInHand={replaceCardInHand}
          hasDrawnCard={hasDrawnCard}
          takeDiscardCard={takeDiscardCard}
        />
      </div>
      <Rules />
    </div>
  );
};

export default App;
