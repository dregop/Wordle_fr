import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import Message from './components/Message';
import Keyboard from './components/Keyboard';
import './App.css';
import { loadDictionary } from './utils/dictionary';


function App() {
  const [targetWord, setTargetWord] = useState(''); // Mot à deviner (aléatoire)
  const [guesses, setGuesses] = useState([]); // Tentatives validées
  const [colors, setColors] = useState([]); // Couleurs associées aux tentatives
  const [currentGuess, setCurrentGuess] = useState(''); // Tentative en cours
  const [message, setMessage] = useState(''); // Messages (victoire, défaite)
  const [spellChecker, setSpellChecker] = useState(null); // Instance de nspell
  const [isGameOver, setIsGameOver] = useState(false);

  // Fonction pour recommencer une partie
  const selectRandomWord = (words) => {
    return words[Math.floor(Math.random() * words.length)].toLowerCase();
  };

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const { spell, words } = await loadDictionary();
        setSpellChecker(spell);
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

    if (currentGuess.length === 5) {
      // Vérifie si le mot existe dans le dictionnaire
      if (!spellChecker.correct(currentGuess)) {
        setMessage("Mot invalide. Essayez un mot français valide.");
        return; // Bloque la validation si le mot est invalide
      } else {
        setMessage("");
      }

      const newColors = getTileColors(currentGuess, targetWord);

      if (currentGuess === targetWord) {
        setMessage('Bravo ! Vous avez trouvé le mot ! 🎉');
        setIsGameOver(true); // Partie terminée
      } else if (guesses.length === 5) {
        setMessage(`Perdu ! Le mot était "${targetWord}". 😢`);
        setIsGameOver(true); // Partie terminée
      }

      setGuesses([...guesses, currentGuess]); // Ajoute la tentative validée
      setColors([...colors, newColors]); // Stocke les couleurs associées
      setCurrentGuess(''); // Réinitialise la tentative
    }
  };

  // Fonction pour calculer les couleurs des lettres
  const getTileColors = (guess, targetWord) => {
    const result = Array(5).fill('absent'); // Par défaut : lettres absentes
    const targetArray = targetWord.split('');
    const guessArray = guess.split('');

    // Lettres bien placées (vert)
    guessArray.forEach((letter, index) => {
      if (letter === targetArray[index]) {
        result[index] = 'correct';
        targetArray[index] = null; // Évite le double comptage
      }
    });

    // Lettres mal placées (jaune)
    guessArray.forEach((letter, index) => {
      if (result[index] !== 'correct' && targetArray.includes(letter)) {
        result[index] = 'present';
        targetArray[targetArray.indexOf(letter)] = null; // Évite le double comptage
      }
    });

    return result;
  };

  // Gestion des interactions clavier (tapées ou cliquées sur le clavier virtuel)
  const handleKeyPress = (key) => {
    if (key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1)); // Supprime la dernière lettre
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key.toLowerCase()); // Ajoute une lettre
    } else if (key === 'Enter') {
      handleValidate(); // Valide la tentative
    }
  };
  
  const resetGame = () => {
    setGuesses([]);
    setColors([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setMessage('');
    setTargetWord(selectRandomWord(words)); // Réutilise la fonction
  };

  // Ajoute un event listener global pour écouter les touches clavier
  useEffect(() => {
    const handlePhysicalKeyPress = (event) => {
      handleKeyPress(event.key); // Passe les interactions clavier physique à handleKeyPress
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [currentGuess]);

  return (
    <div className="App">
      <h1>Wordle Clone FR</h1>
      <Grid guesses={guesses} colors={colors} currentGuess={currentGuess} />
      <Keyboard
        onKeyPress={handleKeyPress}
        onValidate={handleValidate}
        isValidateDisabled={currentGuess.length !== 5} // Désactiver si la tentative est incomplète
      />
      <Message message={message} />
      {isGameOver && (
        <button onClick={resetGame} className="reset-button">
          Recommencer
        </button>
      )}
    </div>
  );
}

export default App;