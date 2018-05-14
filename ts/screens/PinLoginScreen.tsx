import { Button, Container, Content, Icon, Text, View } from "native-base";
import * as React from "react";
import CodeInput from "react-native-confirmation-code-input";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ReduxProps } from "../actions/types";
import Pinpad from "../components/Pinpad";
import TextWithIcon from "../components/ui/TextWithIcon";
import I18n from "../i18n";
import { GlobalState } from "../reducers/types";
import { validatePin } from "../store/actions/pinlogin";
import { PinLoginState } from "../store/reducers/pinlogin";
import variables from "../theme/variables";

type ReduxMappedProps = {
  pinLoginState: PinLoginState;
};
type OwnProps = {
  navigation: NavigationScreenProp<NavigationState>;
};

type Props = ReduxMappedProps & ReduxProps & OwnProps;

/**
 * A screen that allow the user to login with the PIN.
 */
class PinLoginScreen extends React.Component<Props> {
  private pinComponent: CodeInput | null = null;

  constructor(props: Props) {
    super(props);
  }


  // Method called when the CodeInput is filled
  public onPinFulfill = (code: string) => {
    this.props.dispatch(validatePin(code));
    // Clear PIN input
    if (this.pinComponent) {
      this.pinComponent.clear();
    }
  };

  // Render the PIN match/doesn't match feedback message
  public renderCodeInputConfirmValidation = () => {
    const validationMessage = (
      <TextWithIcon danger>
        <Icon name={"cross"} />
        <Text>{I18n.t("pinlogin.pin.confirmInvalid")}</Text>
      </TextWithIcon>
    );
    return (
      <React.Fragment>
        <View spacer extralarge />
        {validationMessage}
      </React.Fragment>
    );
  };

  // Render select/confirm Pinpad component
  public renderCodeInput = (pinLoginState: PinLoginState) => {
    return (
      <React.Fragment>
        <Pinpad
          autofocus={false}
          onFulfill={this.onPinFulfill}
          activeColor={variables.brandWhite}
          inactiveColor={variables.brandWhite}
          codeInputRef={pinpad => (this.pinComponent = pinpad)}
        />

        {pinLoginState === "PinConfirmedInvalid" &&
          this.renderCodeInputConfirmValidation()}
      </React.Fragment>
    );
  };

  // The Content of the Screen
  public renderContent = (pinLoginState: PinLoginState) => {
    return (
      <Content primary>
        <View spacer extralarge />
        <Text white>{I18n.t("pinlogin.pin.pinInfo")}</Text>
        {this.renderCodeInput(pinLoginState)}
        <View spacer extralarge />
        {this.renderForgotButton()}
      </Content>
    );
  };
  // Render the forgot PIN button
  public renderForgotButton = () => {
    return (
      <Button block primary >
        <Text>{I18n.t("pinlogin.pin.pinforgot")}</Text>
      </Button>
    );
  };

  public render() {
    const { pinLoginState } = this.props;
    return <Container>{this.renderContent(pinLoginState)}</Container>;
  }
}

const mapStateToProps = (state: GlobalState): ReduxMappedProps => ({
  // Checks from the store whether there was an error while login with the PIN (e.g. PIN is not valid )
  pinLoginState: state.pinlogin
});
export default connect(mapStateToProps)(PinLoginScreen);
