import React from 'react';
import '../styles/GameOverOverlay.css';

const GameOverOverlay = ({ message, stats, onClose, isAuthenticated }) => {
    console.log(stats);
  return (
    <div className="overlay">
      <div className="modal">
        <h2>Fin de partie</h2>
        <p>{message}</p>
        {isAuthenticated ? (
          stats && (
            <div className="stats">
              <p><strong>Total de parties :</strong> {stats.total_games}</p>
              <p><strong>Parties gagnées :</strong> {stats.wins}</p>
              <p><strong>Taux de victoire :</strong> {stats.win_percentage}%</p>
            </div>
          )
        ) : (
          <div className="signup-prompt">
            <p>Inscrivez-vous pour sauvegarder et consulter vos statistiques de jeu !</p>
            <button onClick={() => window.location.href='/register'}>
              S'inscrire
            </button>
          </div>
        )}
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default GameOverOverlay;
