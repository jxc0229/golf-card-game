// src/Deck.js
import React from 'react';

const Rules = () => {
  return (
    <>
      <div className="card-values-table">
        <div className="card-values-wrapper">
          <h3> Rules (the lower score, the better) </h3>
          <table>
            <tbody>
              <tr>
                <td>Card values</td>
                <td>Scores</td>
              </tr>
              <tr>
                <td>2x2 square</td>
                <td>-20</td>
              </tr>
              <tr>
                <td>Column or row</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Ace</td>
                <td>1</td>
              </tr>
              <tr>
                <td>2</td>
                <td>-2</td>
              </tr>
              <tr>
                <td>3-10</td>
                <td>Face value</td>
              </tr>
              <tr>
                <td>J, Q</td>
                <td>10</td>
              </tr>
              <tr>
                <td>K</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Rules;
