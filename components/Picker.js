import React from "react";
import { Icon, Picker as PickerNB } from "native-base";

import theme from "../theme";

const Picker = props => (
  <PickerNB
    mode="dropdown"
    iosIcon={
      <Icon
        style={{ color: theme.foregroundColor }}
        name="ios-arrow-down-outline"
      />
    }
    style={{
      width: undefined
    }}
    textStyle={{ color: theme.foregroundColor }}
    itemStyle={{
      marginLeft: 0,
      paddingLeft: 10,
      backgroundColor: theme.backgroundColor
    }}
    itemTextStyle={{
      color: theme.foregroundColor
    }}
    headerTitleStyle={{
      color: theme.foregroundColor
    }}
    modalStyle={{
      backgroundColor: theme.backgroundColor
    }}
    headerBackButtonTextStyle={{
      color: theme.foregroundColor
    }}
    headerStyle={{
      backgroundColor: theme.backgroundColor
    }}
    placeholder={props.placeholder}
    placeholderStyle={props.placeholderStyle}
    placeholderIconColor={props.placeholderIconColor}
    selectedValue={props.selectedValue}
    onValueChange={props.onValueChange}
  >
    {props.children}
  </PickerNB>
);

Picker.Item = PickerNB.Item;

export default Picker;
