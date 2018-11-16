import React, { Component } from "react";
import { StyleSheet } from "react-native";

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

import {
  getPercentage,
  getLeastFamiliarCards,
  getGameCards,
  getGameData,
  saveGameData
} from "../gameData";

import theme from "../theme";

type Props = {};

class Game extends Component<Props> {
  async componentDidMount() {
    const gameData =
      this.props.hotList === "All"
        ? await getGameData()
        : getGameCards(this.props.hotList);
    this.setState({
      gameData,
      deck: getLeastFamiliarCards(gameData, this.props.numberOfCards),
      hotList: this.props.hotList,
      numberOfCards: this.props.numberOfCards
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.hotList) return null;
    if (
      nextProps.hotList !== prevState.hotList ||
      nextProps.numberOfCards !== prevState.numberOfCards
    ) {
      const gameData = getGameCards(nextProps.hotList);
      return {
        gameData,
        deck: getLeastFamiliarCards(gameData, nextProps.numberOfCards),
        hotList: nextProps.hotList,
        numberOfCards: nextProps.numberOfCards
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.hotList !== this.props.hotList) {
      this.setState({ hotList: this.props.hotList });
    }

    if (prevProps.numberOfCards !== this.props.numberOfCards) {
      this.setState({ numberOfCards: this.props.numberOfCards });
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
      const newDeck = getLeastFamiliarCards(
        this.state.gameData,
        this.props.numberOfCards
      );
      this.swiper.wrappedInstance.setState({
        lastCard: false,
        disabled: false,
        selectedItem: newDeck[0],
        selectedItem2: newDeck[1]
      });

      this.currentRound.correctAnswers = 0;

      await saveGameData(this.state.gameData);
      this.setState({ deck: newDeck });
    }
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
                    Score: {this.currentRound.correctAnswers}/{
                      this.props.numberOfCards
                    }
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
