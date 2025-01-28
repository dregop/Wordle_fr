import nspell from 'nspell';

export const loadDictionary = async () => {
  const aff = await fetch('/assets/dictionary-fr/index.aff').then((res) => res.text());
  const dic = await fetch('/assets/dictionary-fr/dict_5letters.dic').then((res) => res.text());
  const spell = nspell(aff, dic);

  const words = dic.split('\n').filter((word) => word.trim().length === 5);
  return { spell, words };
};
