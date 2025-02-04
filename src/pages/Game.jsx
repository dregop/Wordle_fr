import React, { useState, useEffect, useRef, useContext } from 'react';
import Grid from '../components/Grid';
import Message from '../components/Message';
import Keyboard from '../components/Keyboard';
import GameOverOverlay from '../components/GameOverOverlay';
import '../styles/App.css';
import { loadDictionary } from '../utils/dictionary';
import { getTileColors, selectRandomWord } from '../utils/gameLogic';
import AuthContext from '../context/AuthContext';
import { saveUserStats } from '../api/userApi';


function Game() {
  const { user, token } = useContext(AuthContext); // Contient les infos de l'utilisateur connecté
  const [targetWord, setTargetWord] = useState(''); // Mot à deviner (aléatoire)
  const allWordsRef = useRef([]); // useRef ne déclenche pas de rendu lorsqu'il est mis à jour, ce qui est utile si allWords ne change pas après le chargement initial.
  const [message, setMessage] = useState(''); // Messages (victoire, défaite)
  const [spellChecker, setSpellChecker] = useState(null); // Instance de nspell
  const [stats, setStats] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const [gameState, setGameState] = useState({
    guesses: [], // Tentatives validées
    NbGuessesRemaining: 5, // 5 Mots invalides autorisés
    colors: [], // Couleurs associées aux tentatives
    currentGuess: '', // Tentative en cours
    isGameOver: false,
    keyboardColors: {},
  });

  // intialise une seule fois au lancement de l'application
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const { spell, words } = await loadDictionary();
        setSpellChecker(spell);
        allWordsRef.current = words;
        setTargetWord(selectRandomWord(words));
      } catch (error) {
        console.error('Erreur lors du chargement du dictionnaire', error);
        setMessage("Erreur lors du chargement du dictionnaire.");
      }
    };
  
    initializeGame();
  }, []);

  // Fonction pour valider une tentative
  const handleValidate = () => {
    if (!spellChecker) {
      setMessage("Le dictionnaire n'est pas encore chargé. Réessayez.");
      return; // Bloque la validation si le dictionnaire n'est pas prêt
    }

    if (gameState.currentGuess.length === 5) {
      // Vérifie si le mot existe dans le dictionnaire
      if (!spellChecker.correct(gameState.currentGuess)) {
        
        if (gameState.NbGuessesRemaining === 0) {
          setMessage(`Perdu vous avez échoué trop de fois ! Le mot était "${targetWord}". 😢`);
          setGameState((prevState) => ({
            ...prevState,
            currentGuess: '',
            isGameOver: true,
          }));
        } else {
          setGameState((prevState) => ({
            ...prevState,
            NbGuessesRemaining: prevState.NbGuessesRemaining - 1,
          }));
          setMessage(`Mot invalide. Essayez un mot français valide. 
          Tentatives restantes : ${gameState.NbGuessesRemaining}`);
        }

        return; // Bloque la validation si le mot est invalide
      } else {
        setMessage("");
      }

      const newColors = getTileColors(gameState.currentGuess, targetWord);

      // Mise à jour des couleurs des lettres sur le clavier
      const updatedKeyboardColors = { ...gameState.keyboardColors };
      gameState.currentGuess.split('').forEach((letter, index) => {
        letter = letter.toUpperCase(); // Car les lettres du clavier virtuel son maj
        // La priorité est : correct > present > absent
        const currentColor = updatedKeyboardColors[letter];
        const newColor = newColors[index];

        if (currentColor === 'correct' || (currentColor === 'present' && newColor === 'absent')) {
          return; // Ne remplace pas les couleurs "correct" ou "present" par "absent"
        }

        updatedKeyboardColors[letter] = newColor;
      });

      setGameState((prevState) => ({
        ...prevState,
        guesses: [...prevState.guesses, gameState.currentGuess],
        colors: [...prevState.colors, newColors],
        currentGuess: '',
        isGameOver: gameState.currentGuess === targetWord || prevState.guesses.length === 5,
        keyboardColors: updatedKeyboardColors, // Met à jour les couleurs du clavier
      }));

      if (gameState.currentGuess === targetWord) {
        setMessage('Bravo ! Vous avez trouvé le mot ! 🎉');
      } else if (gameState.guesses.length === 5) {
        setMessage(`Perdu ! Le mot était "${targetWord}". 😢`);
      }
    }
  };

  // Gestion des interactions clavier (tapées ou cliquées sur le clavier virtuel)
  const handleKeyPress = (key) => {
    if (gameState.isGameOver) {
      return; // Ne fait rien si le jeu est terminé
    }
    
    if (key === 'Backspace') {
      setGameState((prevState) => ({
        ...prevState,
        currentGuess: gameState.currentGuess.slice(0, -1) // Supprime la dernière lettre
      }));
    } else if (/^[a-zA-Z]$/.test(key) && gameState.currentGuess.length < 5) {
      setGameState((prevState) => ({
        ...prevState,
        currentGuess: gameState.currentGuess + key.toLowerCase() // Ajoute une lettre
      }));
    } else if (key === 'Enter') {
      handleValidate(); // Valide la tentative
    }
  };
  
  const resetGame = () => {
    setGameState(() => ({
      isGameOver: false,
      guesses: [],
      NbGuessesRemaining: 5,
      colors: [],
      currentGuess: '',
      keyboardColors: {},
    }));
    setMessage('');
    setTargetWord(selectRandomWord(allWordsRef.current));
  };

  useEffect(() => {
    if (gameState.isGameOver) {
      if (user) {
        const statsToSave = {
          won: gameState.guesses[gameState.guesses.length - 1] === targetWord,
          attempts: gameState.guesses.length,
        };
        console.log(statsToSave);
        saveUserStats(statsToSave, token)
          .then((data) => {
            console.log('Statistiques sauvegardées avec succès', data);
            setStats(data.stats);
          })
          .catch((error) => {
            console.error('Erreur lors de la sauvegarde des statistiques', error);
          });
      }
      setShowOverlay(true);
    }

  }, [gameState.isGameOver, user]);


  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  useEffect(() => {
    const handlePhysicalKeyPress = (event) => {
      handleKeyPress(event.key); // Passe les interactions clavier physique à handleKeyPress
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="App">
      <Grid guesses={gameState.guesses} colors={gameState.colors} currentGuess={gameState.currentGuess} />
      <Keyboard
        onKeyPress={handleKeyPress}
        onValidate={handleValidate}
        isValidateDisabled={gameState.currentGuess.length !== 5} // Désactiver si la tentative est incomplète
        keyboardColors={gameState.keyboardColors} // Passe les couleurs des lettres
      />
      <Message message={message} />
      {gameState.isGameOver && (
        <button onClick={resetGame} className="reset-button">
          Recommencer
        </button>
      )}
      {showOverlay && (
        <GameOverOverlay
          message={message}
          stats={stats}
          onClose={handleCloseOverlay}
          isAuthenticated={!!user}
        />
      )}
    </div>
  );
}

export default Game;