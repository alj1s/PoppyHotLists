import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import { createDrawerNavigator } from "react-navigation";
import { Icon } from "native-base";

import { Game, Settings, Stats } from "./components";
import theme from "./theme";

const GameNavigator = props => (
  <Game
    hotList={props.screenProps.hotList}
    numberOfCards={props.screenProps.numberOfCards}
  />
);

GameNavigator.navigationOptions = {
  drawerLabel: "Game",
  drawerIcon: ({ tintColor }) => (
    <Icon name="flame" style={{ color: tintColor }} />
  )
};

const SettingsNavigator = props => (
  <Settings
    hotList={props.screenProps.hotList}
    numberOfCards={props.screenProps.numberOfCards}
    onHotListChanged={props.screenProps.onHotListChanged}
    onNumberOfCardsChanged={props.screenProps.onNumberOfCardsChanged}
  />
);

SettingsNavigator.navigationOptions = {
  drawerLabel: "Settings",
  drawerIcon: ({ tintColor }) => (
    <Icon style={{ color: tintColor }} name="settings" />
  )
};

const HotListApp = createDrawerNavigator(
  {
    Game: {
      screen: GameNavigator
    },
    Settings: {
      screen: SettingsNavigator
    },
    Stats: {
      screen: Stats
    }
  },
  {
    drawerBackgroundColor: theme.drawerBackgroundColor,
    contentOptions: {
      activeTintColor: "orange",
      activeLabelStyle: { color: "orange" },
      labelStyle: {
        color: theme.drawerForegroundColor
      }
    }
  }
);

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotList: "All",
      numberOfCards: 10
    };
  }

  onHotListChanged = newList => this.setState({ hotList: newList });
  onNumberOfCardsChanged = numberOfCards => this.setState({ numberOfCards });

  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <HotListApp
          screenProps={{
            onHotListChanged: this.onHotListChanged,
            onNumberOfCardsChanged: this.onNumberOfCardsChanged,
            numberOfCards: this.state.numberOfCards,
            hotList: this.state.hotList
          }}
        />
      </React.Fragment>
    );
  }
}
