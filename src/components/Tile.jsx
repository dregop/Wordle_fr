import React from 'react';

function Tile({ letter, color }) {
  return <div className={`tile ${color}`}>{letter}</div>;
}

export default Tile;
