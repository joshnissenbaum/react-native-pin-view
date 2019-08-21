import React, { PureComponent } from "react";
import { View, Text, Animated, TouchableOpacity, Image } from "react-native";

export default class PinTouchable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pressingButton: new Animated.Value(0)
    };
  }

  render() {
    return (
      <TouchableOpacity
        key={"key-item-" + this.props.index}
        activeOpacity={1.0}
        onPressIn={() => {
          Animated.timing(this.state.pressingButton, {
            toValue: 1,
            duration: 150
            // useNativeDriver: true
          }).start();
        }}
        onPressOut={() => {
          Animated.timing(this.state.pressingButton, {
            toValue: 0,
            duration: 150
            // useNativeDriver: true
          }).start();
        }}
        onPress={() => this.props.keyboardOnPress()}
        // hitSlop={item === deleteText ? { left: 200 } : {}}
        disabled={this.props.onPressInactive}
      >
        {this.props.item === this.props.deleteText && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              top: "10%",
              left: 25,
              padding: 20
            }}
          >
            <Image
              source={require("../../../../assets/icons/back-white.png")}
              style={this.props.whiteBackground ? { tintColor: "black" } : { tintColor: "white" }}
            />
          </View>
        )}

        {this.props.item !== this.props.deleteText && (
          <Animated.View
            style={[
              this.props.style,
              {
                backgroundColor: "rgba(255, 255, 255, 0.08)"
              },
              {
                backgroundColor: this.state.pressingButton.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.15)"]
                })
              },
              {
                transform: [
                  {
                    scale: this.state.pressingButton.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1]
                    })
                  }
                ]
              },
              this.props.keyboardViewStyle
            ]}
          >
            <Text
              style={[
                this.props.styles[1],
                {
                  color: this.props.textColor,
                  opacity: 1
                },
                this.props.keyboardViewTextStyle
              ]}
            >
              {this.props.item}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  }
}
