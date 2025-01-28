import React from 'react';
import Tile from './Tile';

function Row({ guess, colors }) {
  return (
    <div className="row">
      {Array.from({ length: 5 }).map((_, i) => (
        <Tile
          key={i}
          letter={guess[i] || ''}
          color={colors[i] || ''} // Applique la couleur si elle existe
        />
      ))}
    </div>
  );
}

export default Row;
