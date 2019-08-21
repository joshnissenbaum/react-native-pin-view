import React from "react";
import { Animated, StyleSheet, View, I18nManager, Text } from "react-native";

class CurrencyView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      amount: "0.00",
      enteredManually: ""
    };
  }

  componentWillReceiveProps(props) {
    if (props.inputtedValues !== this.props.inputtedValues) {
      let amount = "";
      let enteredManually = "";

      if (props.inputtedValues.length === 0) {
        amount = "0.00";
        enteredManually = "";
      } else {
        props.inputtedValues.map(value => {
          amount += value;
          enteredManually += value;
        });
      }

      this.setState({
        amount: parseFloat(amount)
          .toFixed(2)
          .toString(),
        enteredManually
      });

      this.props.amountUpdated(parseFloat(amount).toFixed(2));
    }
  }

  render() {
    return (
      <View style={{ marginTop: "5%" }}>
        <Text style={styles.dollarAmountText}>${this.renderAmount()}</Text>
      </View>
    );
  }

  renderAmount() {
    let amountFormatted = [];

    for (let i = 0; i < this.state.amount.length; i++) {
      if (this.state.amount.length === 7 && i === 1) {
        amountFormatted.push(<Text style={[styles.dollarAmountText]}>,</Text>);
      } else if (this.state.amount.length === 8 && i === 2) {
        amountFormatted.push(<Text style={[styles.dollarAmountText]}>,</Text>);
      } else if (this.state.amount.length === 9 && i === 3) {
        amountFormatted.push(<Text style={[styles.dollarAmountText]}>,</Text>);
      } else if (this.state.amount.length === 10 && i === 4) {
        amountFormatted.push(<Text style={[styles.dollarAmountText]}>,</Text>);
      }

      if (!this.state.enteredManually.includes(this.state.amount.charAt(i))) {
        amountFormatted.push(
          <Text style={[styles.dollarAmountText, { color: "#B6B6B6" }]}>{this.state.amount.charAt(i)}</Text>
        );
      } else {
        amountFormatted.push(<Text style={[styles.dollarAmountText]}>{this.state.amount.charAt(i)}</Text>);
      }
    }

    return amountFormatted;
  }
}

const styles = StyleSheet.create({
  dollarAmountText: {
    fontFamily: "Hind-Medium",
    fontSize: 44,
    alignSelf: "center"
  }
});

export default CurrencyView;
