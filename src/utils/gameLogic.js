export const getTileColors = (guess, targetWord) => {
  const result = Array(5).fill('absent');
  const targetArray = targetWord.split('');
  const guessArray = guess.split('');

  // Lettres bien placées (vert)
  guessArray.forEach((letter, index) => {
    if (letter === targetArray[index]) {
      result[index] = 'correct';
      targetArray[index] = null; // Empêche le double comptage
    }
  });

  // Lettres présentes mais mal placées (jaune)
  guessArray.forEach((letter, index) => {
    if (result[index] !== 'correct' && targetArray.includes(letter)) {
      result[index] = 'present';
      targetArray[targetArray.indexOf(letter)] = null;
    }
  });

  return result;
};

export const selectRandomWord = (words) =>
  words[Math.floor(Math.random() * words.length)].toLowerCase();
