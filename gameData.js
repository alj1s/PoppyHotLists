import { AsyncStorage } from "react-native";
import R from "ramda";

import hotLists from "./cards";

const STORAGE_KEY = "@hotlist:data";

export const getPercentage = card =>
  card.appearances === 0
    ? card.appearances
    : card.correctGuesses / card.appearances;

export const getLeastFamiliarCards = (gameData, cardsPerRound) =>
  gameData
    .sort((a, b) => getPercentage(a) - getPercentage(b))
    .slice(0, cardsPerRound);

export const getGameCards = color => {
  if (!!color && color != "All") {
    return hotLists[color].map(word => ({
      color,
      word,
      appearances: 0,
      correctGuesses: 0
    }));
  }
  return Object.keys(hotLists).reduce((acc, color) => {
    return acc.concat(
      hotLists[color].map(word => ({
        color,
        word,
        appearances: 0,
        correctGuesses: 0
      }))
    );
  }, []);
};

export const getGameData = async selectedList => {
  const savedData = await AsyncStorage.getItem(STORAGE_KEY);
  if (!!savedData) return JSON.parse(savedData);
  return getGameCards(selectedList);
};

export const saveGameData = async gameData =>
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));

export const clearGameData = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};

export const getStats = async () => {
  const gameData = await getGameData();
  const lists = R.groupBy(data => data.color)(gameData);
  return R.mapObjIndexed(value => {
    const appearances = value.reduce(
      (prev, next) => prev + next.appearances,
      0
    );
    if (appearances === 0) return "Not tested";
    return (
      (
        value.reduce((prev, next) => prev + next.correctGuesses, 0) *
        100 /
        appearances
      ).toFixed(2) + "%"
    );
  })(lists);
};
