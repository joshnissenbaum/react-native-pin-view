import React from "react";
import { Animated, View } from "react-native";
import KeyboardView from "./libs/parts/KeyboardView";
import InputView from "./libs/parts/InputView";
import CurrencyView from "./libs/parts/CurrencyView";
import Styles from "./libs/parts/styles";
import PropTypes from "prop-types";

//yo

class PinView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedInputIndex: Object.assign([]),
      animatedDeleteButton: new Animated.Value(0),
      pinViewAnim: new Animated.Value(0),
      wrongPinAnim: new Animated.Value(0),
      animatedDeleteButtonOnPress: true
    };
    this.keyboardOnPress = this.keyboardOnPress.bind(this);
    this.setDeleteButton = this.setDeleteButton.bind(this);
    this.clear = this.clear.bind(this);
  }

  userInput = [];
  setDeleteButton = status => {
    Animated.timing(
      // Animate value over time
      this.state.animatedDeleteButton, // The value to drive
      {
        toValue: status ? 1 : 0, // Animate to final value of 1
        duration: 100
      }
    ).start(); // Start the animation
    this.setState({
      animatedDeleteButtonOnPress: !status
    });
  };

  clear() {
    this.userInput = [];
    this.setState({
      animatedInputIndex: Object.assign([]),
      pinViewAnim: new Animated.Value(0)
    });
  }

  componentWillReceiveProps(props) {
    if (props.wrongPinEntered) {
      Animated.sequence([
        Animated.spring(this.state.wrongPinAnim, {
          toValue: 0,
          speed: 400,
          useNativeDriver: true
        }),
        Animated.spring(this.state.wrongPinAnim, {
          toValue: 1,
          speed: 400,
          useNativeDriver: true
        }),
        Animated.spring(this.state.wrongPinAnim, {
          toValue: 0,
          bounciness: 60,
          useNativeDriver: true
        })
      ]).start();
    }
  }

  keyboardOnPress = (val, returnType, pinLength, onComplete) => {
    if (this.userInput.length <= pinLength) {
      if (val === "." && this.userInput.length === 0) {
        this.userInput = ["0", "."];

        this.props.amountUpdated(this.userInput);

        return;
      }

      if (val === "." && this.userInput.find(i => i === ".")) {
        return;
      }

      if (val === this.props.deleteText) {
        this.userInput = this.userInput.slice(0, -1);
        this.setState({
          animatedInputIndex: this.state.animatedInputIndex.slice(0, -1)
        });
        if (this.userInput.length === 0) {
          this.setDeleteButton(false);
        }
      } else {
        if (pinLength === this.userInput.length + 1) {
          this.userInput = this.userInput.concat(parseInt(val));

          this.setDeleteButton(true);
          this.setState(
            {
              animatedInputIndex: this.state.animatedInputIndex.concat(this.userInput.indexOf(parseInt(val)))
            },
            () => {
              setTimeout(() => {
                if (returnType === "string") {
                  return onComplete(this.userInput.join(""), this.clear);
                } else if (returnType === "array") {
                  return onComplete(this.userInput, this.clear);
                } else {
                  console.log("Unkown return type!");
                }
              }, this.props.delayBeforeOnComplete);
            }
          );
        } else {
          let fVal = val;

          if (!this.props.currencyInput) {
            fVal = parseInt(val);
          }

          this.userInput = this.userInput.concat(fVal);
          this.setDeleteButton(true);
          this.setState({
            animatedInputIndex: this.state.animatedInputIndex.concat(this.userInput.indexOf(fVal))
          });

          if (this.props.amountUpdated) {
            this.props.amountUpdated(fVal);
          }
        }
      }
    } else {
      if (val === this.props.deleteText) {
        this.userInput = this.userInput.slice(0, -1);
        this.setState({
          animatedInputIndex: this.state.animatedInputIndex.slice(0, -1)
        });
        if (this.userInput.length === 0) {
          this.setDeleteButton(false);
        }
      }
    }
  };

  render() {
    const {
      pinLength,
      showInputs,
      inputTextStyle,
      keyboardViewStyle,
      keyboardViewTextStyle,
      inputViewStyle,
      buttonTextColor,
      returnType,
      buttonBgColor,
      inputBgColor,
      onComplete,
      disabled,
      inputActiveBgColor,
      inputBgOpacity,
      deleteText,
      whiteBackground,
      currencyInput
    } = this.props;
    return (
      <View pointerEvents={disabled ? "none" : undefined}>
        {currencyInput && (
          <CurrencyView
            inputViewStyle={inputViewStyle}
            showInputs={showInputs}
            inputTextStyle={inputTextStyle}
            bgOpacity={inputBgOpacity}
            inputtedValues={showInputs ? this.userInput : undefined}
            pinLength={pinLength}
            activeBgColor={inputActiveBgColor}
            animatedInputIndex={this.state.animatedInputIndex}
            pinViewAnim={this.state.pinViewAnim}
            bgColor={inputBgColor}
            styles={[Styles.passwordInputView, Styles.passwordInputViewItem, Styles.passwordInputViewItemActive]}
            amountUpdated={this.props.amountUpdated}
          />
        )}
        {!currencyInput && (
          <InputView
            inputViewStyle={inputViewStyle}
            showInputs={showInputs}
            inputTextStyle={inputTextStyle}
            bgOpacity={inputBgOpacity}
            inputtedValues={showInputs ? this.userInput : undefined}
            pinLength={pinLength}
            activeBgColor={inputActiveBgColor}
            animatedInputIndex={this.state.animatedInputIndex}
            pinViewAnim={this.state.pinViewAnim}
            wrongPinAnim={this.state.wrongPinAnim}
            bgColor={inputBgColor}
            styles={[Styles.passwordInputView, Styles.passwordInputViewItem, Styles.passwordInputViewItemActive]}
          />
        )}
        <View style={Styles.keyboardView}>
          <KeyboardView
            keyboardViewStyle={keyboardViewStyle}
            keyboardViewTextStyle={keyboardViewTextStyle}
            styles={[Styles.keyboardViewItem, Styles.keyboardViewItemText]}
            bgColor={buttonBgColor}
            textColor={buttonTextColor}
            animatedDeleteButton={this.state.animatedDeleteButton}
            pinLength={pinLength}
            deleteText={deleteText}
            onComplete={onComplete}
            animatedDeleteButtonOnPress={this.state.animatedDeleteButtonOnPress}
            keyboardOnPress={this.keyboardOnPress}
            returnType={returnType}
            whiteBackground={whiteBackground}
            currencyInput={currencyInput}
          />
        </View>
      </View>
    );
  }
}

PinView.defaultProps = {
  deleteText: "DEL",
  buttonBgColor: "#FFF",
  buttonTextColor: "#333",
  inputBgColor: "#333",
  inputActiveBgColor: "#333",
  returnType: "string",
  inputBgOpacity: 0.1,
  disabled: false,
  clear: false,
  delayBeforeOnComplete: 175,
  inputTextStyle: { color: "#FFF", fontWeight: "bold" },
  showInputs: false,
  whiteBackground: false,
  currencyInput: false
};
PinView.propTypes = {
  disabled: PropTypes.bool,
  deleteText: PropTypes.string,
  returnType: PropTypes.string,
  buttonBgColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  inputBgColor: PropTypes.string,
  inputActiveBgColor: PropTypes.string,
  inputBgOpacity: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
  pinLength: PropTypes.number.isRequired,
  delayBeforeOnComplete: PropTypes.number,
  clear: PropTypes.bool,
  inputTextStyle: PropTypes.object,
  showInputs: PropTypes.bool,
  inputViewStyle: PropTypes.object,
  keyboardViewStyle: PropTypes.object,
  whiteBackground: PropTypes.bool,
  currencyInput: PropTypes.bool
};

export default PinView;
