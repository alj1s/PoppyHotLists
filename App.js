import React, { Component } from "react";
import { createDrawerNavigator } from "react-navigation";
import { Icon } from "native-base";

import { Game, Settings, Stats } from "./components";
import theme from "./theme";

let hotList = "All";

const onHotListChanged = newList => (hotList = newList);

const GameNavigator = () => <Game hotList={hotList} />;

GameNavigator.navigationOptions = {
  drawerLabel: "Game",
  drawerIcon: ({ tintColor }) => (
    <Icon name="flame" style={{ color: tintColor }} />
  )
};

const SettingsNavigator = () => (
  <Settings onHotListChanged={onHotListChanged} />
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

export default props => <HotListApp />;
