import React, { Component } from "react";
import { Button, Container, Content, Header, Icon, Text } from "native-base";
import { AsyncStorage } from "react-native";

import theme from "../theme";

type Props = {};

const STORAGE_KEY = "@hotlist:data";
class Stats extends Component<Props> {
  static navigationOptions = {
    drawerLabel: "Stats",
    drawerIcon: ({ tintColor }) => (
      <Icon name="stats" style={{ color: tintColor }} />
    )
  };

  onClearStats = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  render() {
    return (
      <Container style={{ backgroundColor: theme.backgroundColor }}>
        <Header transparent>
          <Text style={{ color: theme.foregroundColor }}>Stats</Text>
        </Header>
        <Content>
          <Button danger onPress={this.onClearState}>
            <Text>Clear stats</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default Stats;
