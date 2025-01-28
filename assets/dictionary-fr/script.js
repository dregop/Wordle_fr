import fs from 'fs';
import path from 'path';

// Chemin du fichier d'entrée (index.dic)
const inputFilePath = path.join(process.cwd(), 'index.dic'); // Remplace par le chemin vers ton fichier .dic

// Chemin du fichier de sortie
const outputFilePath = path.join(process.cwd(), 'dict_5letters.dic');

// Fonction pour vérifier si un mot est un nom propre ou une molécule
const isProperNameOrMolecule = (word) => {
  // Exclure les mots qui commencent par une majuscule (noms propres)
  if (word[0] === word[0].toUpperCase()) {
    return true;
  }

  // Exclure les mots contenant des chiffres ou des caractères spéciaux
  if (/\d|[-_]/.test(word)) {
    return true;
  }

  // Exclure les mots avec des suffixes ou préfixes typiques des molécules
  const moleculePatterns = [/ase$/, /ine$/, /ol$/, /^meta/, /^iso/];
  if (moleculePatterns.some((pattern) => pattern.test(word))) {
    return true;
  }

  return false;
};

// Fonction pour retirer les accents d'un mot
const removeAccents = (word) => {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };
  

// Fonction pour filtrer les mots de 5 lettres
const filterWords = () => {
  try {
    // Lecture du fichier .dic
    const data = fs.readFileSync(inputFilePath, 'utf8');

    // Découper le fichier par ligne et filtrer les mots de 5 lettres
    const filteredWords = data
      .split('\n') // Découpe en lignes
      .map((line) => line.split('/')[0].trim()) // Récupère le mot avant "/" (si présent)
      .filter((word) => word.length === 5) // Conserve uniquement les mots de 5 lettres
      .map((word) => removeAccents(word)) // Supprime les accents des mots
      .filter((word) => !isProperNameOrMolecule(word)); // Exclut les noms propres et molécules

    // Écriture des mots filtrés dans un nouveau fichier
    fs.writeFileSync(outputFilePath, filteredWords.join('\n'), 'utf8');

    console.log(`Dictionnaire filtré créé : ${outputFilePath}`);
    console.log(`Nombre de mots : ${filteredWords.length}`);
  } catch (error) {
    console.error('Erreur lors du traitement du dictionnaire :', error);
  }
};

// Appel de la fonction
filterWords();
