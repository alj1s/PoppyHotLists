import React, { Component } from "react";
import { Alert, AsyncStorage, StyleSheet } from "react-native";

import {
  Button,
  Card,
  CardItem,
  Container,
  DeckSwiper,
  Header,
  Text,
  View
} from "native-base";

const STORAGE_KEY = "@hotlist:data";

const hotLists = {
  yellow: ["like", "and", "I", "a", "we", "can", "the", "is", "go", "to"],
  pink: ["they", "be", "do", "for", "of", "my", "it", "as", "was", "said"],
  red: ["by", "he", "come", "where", "has", "saw", "at", "in", "are", "with"],
  green: [
    "she",
    "am",
    "when",
    "if",
    "that",
    "could",
    "you",
    "on",
    "from",
    "here"
  ],
  gold: ["so", "were", "your", "much", "who", "don't", "there", "been"]
};

const allCards = Object.keys(hotLists).reduce((acc, color) => {
  return acc.concat(
    hotLists[color].map(word => ({
      color,
      word,
      appearances: 0,
      correctGuesses: 0
    }))
  );
}, []);

const cardsPerRound = 10;

const getPercentage = card =>
  card.appearances === 0
    ? card.appearances
    : card.correctGuesses / card.appearances;

const getLeastFamiliarCards = gameData =>
  gameData
    .sort((a, b) => getPercentage(a) - getPercentage(b))
    .slice(0, cardsPerRound);

type Props = {};

export default class App extends Component<Props> {
  async componentDidMount() {
    const gameData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!!gameData) {
      const currentState = JSON.parse(gameData);
      this.setState({
        gameData: currentState,
        deck: getLeastFamiliarCards(currentState)
      });
    } else {
      this.setState({
        gameData: allCards,
        deck: getLeastFamiliarCards(allCards)
      });
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
      <Container style={{ backgroundColor: "#333", justifyContent: "center" }}>
        <DeckSwiper
          ref={swiper => {
            this.swiper = swiper;
          }}
          looping={false}
          dataSource={this.state.deck}
          onSwipeLeft={this.incorrectGuess}
          onSwipeRight={this.correctGuess}
          renderEmpty={() => (
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 20,
                  fontSize: 24,
                  textAlign: "center",
                  color: "#fff"
                }}
              >
                Score: {this.currentRound.correctAnswers}/{cardsPerRound}
              </Text>
              <Button
                large
                onPress={this.restart}
                style={{
                  marginLeft: "40%",
                  marginRight: "20%"
                }}
              >
                <Text>Play again</Text>
              </Button>
            </View>
          )}
          renderItem={word => (
            <Card
              style={{
                elevation: 3,
                borderRadius: 15,
                marginTop: -80,
                marginLeft: "20%",
                marginRight: "20%",
                backgroundColor: word.color,
                padding: 8
              }}
            >
              <CardItem
                cardBody
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
