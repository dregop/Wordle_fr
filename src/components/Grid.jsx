import React from 'react';
import Row from './Row';

function Grid({ guesses, colors, currentGuess }) {
  return (
    <div className="grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <Row
          key={i}
          guess={guesses[i] || (i === guesses.length ? currentGuess : '')}
          colors={colors[i] || []} // Associe les couleurs à la tentative validée
        />
      ))}
    </div>
  );
}

export default Grid;
