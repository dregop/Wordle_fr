import React from 'react';

function Keyboard({ onKeyPress, onValidate, isValidateDisabled, keyboardColors }) {
  const rows = [
    'AZERTYUIOP',
    'QSDFGHJKLM',
    'WXCVBN',
  ];

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.split('').map((letter) => (
            <button
              key={letter}
              className={`key ${keyboardColors[letter] || ''}`} // Applique la couleur si elle existe
              onClick={(e) => {
                onKeyPress(letter);
                e.target.blur(); // Supprime le focus du bouton après le clic
              }}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-actions">
        <button onClick={onValidate} disabled={isValidateDisabled} className="validate-button">
          Entrer
        </button>
        <button onClick={() => onKeyPress('Backspace')} className="keyboard-key special">
          Retour
        </button>
      </div>
    </div>
  );
}

export default Keyboard;
