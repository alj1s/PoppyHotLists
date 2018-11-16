import React, { Component } from "react";
import {
  Button,
  H3,
  Container,
  Content,
  Header,
  Icon,
  Text
} from "native-base";
import { AsyncStorage, View } from "react-native";
import startCase from "lodash.startcase";

import theme from "../theme";
import { getStats, clearGameData } from "../gameData";

type Props = {};

class Stats extends Component<Props> {
  static navigationOptions = {
    drawerLabel: "Stats",
    drawerIcon: ({ tintColor }) => (
      <Icon name="stats" style={{ color: tintColor }} />
    )
  };

  state = {};

  async componentDidMount() {
    const stats = await getStats();
    console.log("stats", stats);
    this.setState({ stats });
  }

  onClearStats = async () => {
    await clearGameData();
  };

  render() {
    if (!this.state.stats) return null;

    return (
      <Container style={{ backgroundColor: theme.backgroundColor }}>
        <Header transparent>
          <Text style={{ color: theme.foregroundColor }}>Stats</Text>
        </Header>
        <Content style={{ paddingLeft: 10, paddingRight: 10 }}>
          {Object.keys(this.state.stats).map(stat => (
            <View
              style={{
                paddingBottom: 10,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <H3 style={{ color: theme.foregroundColor }}>
                {startCase(stat)}
              </H3>
              <Text style={{ color: theme.foregroundColor }}>
                {this.state.stats[stat]}
              </Text>
            </View>
          ))}
          <Button style={{ marginTop: 10 }} danger onPress={this.onClearStats}>
            <Text>Clear stats</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default Stats;
