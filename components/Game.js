import React, { Component } from "react";
import { AsyncStorage, StyleSheet } from "react-native";

import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  DeckSwiper,
  Left,
  Right,
  Text,
  View
} from "native-base";

import hotLists from "../cards";
import theme from "../theme";

const STORAGE_KEY = "@hotlist:data";
const cardsPerRound = 10;

const getPercentage = card =>
  card.appearances === 0
    ? card.appearances
    : card.correctGuesses / card.appearances;

const getLeastFamiliarCards = gameData =>
  gameData
    .sort((a, b) => getPercentage(a) - getPercentage(b))
    .slice(0, cardsPerRound);

const getGameCards = color => {
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

const getGameData = async selectedList => {
  const savedData = await AsyncStorage.getItem(STORAGE_KEY);
  if (!!savedData) return JSON.parse(savedData);
  return getGameCards(selectedList);
};

type Props = {};

class Game extends Component<Props> {
  async componentDidMount() {
    const gameData = await getGameData();
    this.setState({
      gameData,
      deck: getLeastFamiliarCards(gameData)
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.hotList && nextProps.hotList !== prevState.hotList) {
      const gameData = getGameCards(nextProps.hotList);
      console.log("Returning new state");
      return {
        gameData,
        deck: getLeastFamiliarCards(gameData),
        hotList: nextProps.hotList
      };
    } else {
      return null;
    }
  }

  state = {};
  currentRound = { correctAnswers: 0 };

  incorrectGuess = word => {
    word.appearances += 1;
  };

  correctGuess = word => {
    word.correctGuesses += 1;
    word.appearances += 1;
    this.currentRound.correctAnswers += 1;
  };

  restart = async () => {
    if (this.swiper) {
      const newDeck = getLeastFamiliarCards(this.state.gameData);
      this.setState({ deck: newDeck });
      this.swiper.wrappedInstance.setState({
        lastCard: false,
        disabled: false,
        selectedItem: newDeck[0],
        selectedItem2: newDeck[1]
      });
    }

    this.currentRound.correctAnswers = 0;

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.state.gameData)
    );
  };

  render() {
    if (!this.state.deck) return null;

    return (
      <Container
        style={{
          backgroundColor: theme.backgroundColor,
          justifyContent: "center"
        }}
      >
        <View
          style={{
            height: "100%",
            marginLeft: "20%",
            marginRight: "20%",
            justifyContent: "center"
          }}
        >
          <DeckSwiper
            ref={swiper => {
              this.swiper = swiper;
            }}
            looping={false}
            dataSource={this.state.deck}
            onSwipeLeft={this.incorrectGuess}
            onSwipeRight={this.correctGuess}
            renderEmpty={() => (
              <Card
                transparent
                style={{
                  borderStyle: "solid",
                  marginTop: -80,
                  borderWidth: 1,
                  borderColor: "green"
                }}
              >
                <CardItem header style={{ backgroundColor: "transparent" }}>
                  <Left />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "#fff"
                    }}
                  >
                    Score: {this.currentRound.correctAnswers}/{cardsPerRound}
                  </Text>
                  <Right />
                </CardItem>
                <CardItem style={{ backgroundColor: "transparent" }}>
                  <Left />
                  <Body>
                    <Button large onPress={this.restart}>
                      <Text>Play again</Text>
                    </Button>
                  </Body>
                  <Right />
                </CardItem>
              </Card>
            )}
            renderItem={word => (
              <Card
                style={{
                  elevation: 3,
                  borderRadius: 15,
                  backgroundColor: word.color,
                  marginTop: -80,
                  padding: 8
                }}
              >
                <CardItem
                  style={{
                    borderRadius: 15,
                    paddingTop: 50,
                    paddingBottom: 50,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 44
                    }}
                  >
                    {word.word}
                  </Text>
                </CardItem>
              </Card>
            )}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});

export default Game;
