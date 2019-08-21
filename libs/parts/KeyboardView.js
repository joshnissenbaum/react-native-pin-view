import React from "react";
import { Animated, View, Image, FlatList, Text, TouchableOpacity, I18nManager } from "react-native";
import PinTouchable from "react-native-pin-view/libs/parts/PinTouchable";

const KeyboardView = ({
  keyboardOnPress,
  keyboardViewStyle,
  keyboardViewTextStyle,
  pinLength,
  onComplete,
  bgColor,
  returnType,
  textColor,
  animatedDeleteButton,
  deleteText,
  animatedDeleteButtonOnPress,
  whiteBackground,
  styles,
  currencyInput
}) => {
  let data;
  if (I18nManager.isRTL) {
    data = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", deleteText, null].reverse();
  } else {
    data = ["1", "2", "3", "4", "5", "6", "7", "8", "9", currencyInput ? "." : "empty", "0", deleteText];
  }
  const renderItem = ({ item, index }) => {
    let style;
    let onPressInactive;
    if (item === deleteText) {
      onPressInactive = animatedDeleteButtonOnPress;
      style = [
        styles[0],
        {
          opacity: animatedDeleteButton,
          justifyContent: "center"
        }
      ];
    } else if (item === "empty") {
      style = [
        styles[0],
        {
          opacity: 0
        }
      ];
    } else {
      onPressInactive = false;
      style = [styles[0]];
    }

    return (
      <PinTouchable
        index={index}
        item={item}
        deleteText={deleteText}
        whiteBackground={whiteBackground}
        keyboardViewStyle={keyboardViewStyle}
        textColor={textColor}
        styles={styles}
        style={style}
        keyboardOnPress={() => keyboardOnPress(item, returnType, pinLength, onComplete)}
        onPressInactive={onPressInactive}
      />
    );
  };
  return (
    <FlatList
      contentContainerStyle={{
        flexDirection: I18nManager.isRTL ? "column-reverse" : "column",
        alignItems: I18nManager.isRTL ? "flex-end" : "flex-start"
      }}
      scrollEnabled={false}
      horizontal={false}
      vertical={true}
      numColumns={3}
      renderItem={renderItem}
      data={data}
      keyExtractor={(val, index) => "pinViewItem-" + index}
    />
  );
};
export default KeyboardView;
