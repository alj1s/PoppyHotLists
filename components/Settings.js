import React, { Component } from "react";
import {
  Body,
  Button,
  Container,
  Content,
  Form,
  Header,
  Icon,
  ListItem,
  Left,
  Picker,
  Right,
  Text
} from "native-base";

import theme from "../theme";
import hotLists from "../cards";

type Props = {};

class Settings extends Component<Props> {
  state = {
    selectedHotList: "All"
  };

  onHotListChanged = newList => {
    this.setState({ selectedHotList: newList });
    this.props.onHotListChanged(newList);
  };

  onNumberOfCardsChanged = numberOfCards => {
    this.setState({ numberOfCards: numberOfCards });
    this.props.onNumberOfCardsChanged(numberOfCards);
  };

  render() {
    return (
      <Container style={{ backgroundColor: theme.backgroundColor }}>
        <Header transparent>
          <Text style={{ color: theme.foregroundColor }}>Settings</Text>
        </Header>
        <Content>
          <Form>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "orange" }}>
                  <Icon name="flame" active />
                </Button>
              </Left>
              <Body>
                <Text style={{ color: theme.foregroundColor }}>HotList</Text>
              </Body>
              <Right>
                <Picker
                  mode="dropdown"
                  iosIcon={
                    <Icon
                      style={{ color: theme.foregroundColor }}
                      name="ios-arrow-down-outline"
                    />
                  }
                  style={{ width: undefined }}
                  textStyle={{ color: theme.foregroundColor }}
                  placeholder="Select hot list"
                  placeholderStyle={{ color: theme.settingPlaceholderColor }}
                  placeholderIconColor={theme.settingPlaceholderColor}
                  selectedValue={this.state.selectedHotList}
                  onValueChange={this.onHotListChanged}
                >
                  <Picker.Item label="All" value="All" />
                  {Object.keys(hotLists).map(l => (
                    <Picker.Item key={l} label={l} value={l} />
                  ))}
                </Picker>
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{}}>
                  <Icon name="albums" active />
                </Button>
              </Left>
              <Body>
                <Text style={{ color: theme.foregroundColor }}>
                  Cards per game
                </Text>
              </Body>
              <Right />
            </ListItem>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default Settings;
