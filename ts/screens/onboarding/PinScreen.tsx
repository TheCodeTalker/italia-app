import {
  Body,
  Button,
  Container,
  Content,
  H1,
  Icon,
  Left,
  Text,
  View
} from "native-base";
import * as React from "react";
import CodeInput from "react-native-confirmation-code-input";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";

import { Option } from "fp-ts/lib/Option";
import { ReduxProps } from "../../actions/types";
import Pinpad from "../../components/Pinpad";
import AppHeader from "../../components/ui/AppHeader";
import TextWithIcon from "../../components/ui/TextWithIcon";
import I18n from "../../i18n";
import { GlobalState } from "../../reducers/types";
import { createPin } from "../../store/actions/onboarding";
import { createErrorSelector } from "../../store/reducers/error";

type ReduxMappedProps = {
  pinSaveError: Option<string>;
};

type OwnProps = {
  navigation: NavigationScreenProp<NavigationState>;
};

type Props = ReduxMappedProps & ReduxProps & OwnProps;

type PinUnselected = {
  state: "PinUnselected";
};

type PinSelected = {
  state: "PinSelected";
  // User selected PIN
  pin: string;
};

type PinConfirmed = {
  state: "PinConfirmed";
  pin: string;
  // True if the confirmation PIN match
  isConfirmationPinMatch: boolean;
};

type PinState = PinUnselected | PinSelected | PinConfirmed;

type State = {
  pinState: PinState;
};

/**
 * A screen that allow the user to set the PIN.
 */
class PinScreen extends React.Component<Props, State> {
  private pinConfirmComponent: CodeInput | null = null;

  constructor(props: Props) {
    super(props);

    // Initial state with PinUnselected
    this.state = {
      pinState: {
        state: "PinUnselected"
      }
    };
  }

  private goBack() {
    this.props.navigation.goBack();
  }

  // Method called when the first CodeInput is filled
  public onPinFulfill(code: string) {
    this.setState({
      pinState: {
        state: "PinSelected",
        pin: code
      }
    });
  }

  // Method called when the confirmation CodeInput is filled
  public onPinConfirmFulfill(isValid: boolean, code: string) {
    // If the inserted PIN do not match we clear the component to let the user retry
    if (!isValid) {
      if (this.pinConfirmComponent) {
        this.pinConfirmComponent.clear();
      }
    }
    this.setState({
      pinState: {
        state: "PinConfirmed",
        pin: code,
        isConfirmationPinMatch: isValid
      }
    });
  }

  public onPinReset() {
    if (this.pinConfirmComponent) {
      this.pinConfirmComponent.clear();
    }
    this.setState({
      pinState: {
        state: "PinUnselected"
      }
    });
  }

  // Dispatch the Action that save the PIN in the Keychain
  public createPin(pin: string) {
    this.props.dispatch(createPin(pin));
  }

  // Render a different header when the user need to confirm the PIN
  public renderContentHeader(pinState: PinState) {
    if (pinState.state === "PinUnselected") {
      return <H1>{I18n.t("onboarding.pin.contentTitle")}</H1>;
    } else {
      return <H1>{I18n.t("onboarding.pin.contentTitleConfirm")}</H1>;
    }
  }

  // Render the PIN match/doesn't match feedback message
  public renderCodeInputConfirmValidation(pinState: PinConfirmed) {
    const validationMessage = pinState.isConfirmationPinMatch ? (
      <TextWithIcon success={true}>
        <Icon name={"check"} />
        <Text>{I18n.t("onboarding.pin.confirmValid")}</Text>
      </TextWithIcon>
    ) : (
      <TextWithIcon danger={true}>
        <Icon name={"cross"} />
        <Text>{I18n.t("onboarding.pin.confirmInvalid")}</Text>
      </TextWithIcon>
    );
    return (
      <React.Fragment>
        <View spacer={true} extralarge={true} />
        {validationMessage}
      </React.Fragment>
    );
  }

  // Render select/confirm Pinpad component
  public renderCodeInput(pinState: PinState) {
    if (pinState.state === "PinUnselected") {
      /**
       * The component that allows the user to SELECT the PIN.
       */
      return (
        <Pinpad
          autofocus={false}
          onFulfill={(code: string) => this.onPinFulfill(code)}
        />
      );
    } else {
      /**
       * The component that allows the user to CONFIRM the PIN.
       */
      return (
        <React.Fragment>
          <Pinpad
            autofocus={true}
            compareWithCode={pinState.pin}
            onFulfill={(isValid, code) =>
              this.onPinConfirmFulfill(isValid, code)
            }
          />

          {pinState.state === "PinConfirmed" &&
            this.renderCodeInputConfirmValidation(pinState)}
        </React.Fragment>
      );
    }
  }

  // The Content of the Screen
  public renderContent(pinState: PinState) {
    return (
      <Content>
        {this.renderContentHeader(pinState)}

        <View spacer={true} extralarge={true} />

        {this.renderCodeInput(pinState)}

        <View spacer={true} extralarge={true} />

        <Text>{I18n.t("onboarding.pin.pinInfo")}</Text>
        <Text link={true}>{I18n.t("onboarding.pin.moreLinkText")}</Text>
      </Content>
    );
  }

  public renderContinueButton(pinState: PinState) {
    if (pinState.state === "PinConfirmed") {
      const { pin, isConfirmationPinMatch } = pinState;
      const onPress = () => this.createPin(pin);
      return (
        <Button
          block={true}
          primary={true}
          disabled={!isConfirmationPinMatch}
          onPress={onPress}
        >
          <Text>{I18n.t("onboarding.pin.continue")}</Text>
        </Button>
      );
    } else {
      return (
        <Button block={true} primary={true} disabled={true}>
          <Text>{I18n.t("onboarding.pin.continue")}</Text>
        </Button>
      );
    }
  }

  // The Footer of the Screen
  public renderFooter(pinState: PinState) {
    return (
      <View footer={true}>
        {this.renderContinueButton(pinState)}

        {pinState.state !== "PinUnselected" && (
          <React.Fragment>
            <View spacer={true} />

            <Button
              block={true}
              bordered={true}
              onPress={_ => this.onPinReset()}
            >
              <Text>{I18n.t("onboarding.pin.reset")}</Text>
            </Button>
          </React.Fragment>
        )}
      </View>
    );
  }

  public render() {
    const { pinState } = this.state;

    return (
      <Container>
        <AppHeader>
          <Left>
            <Button transparent={true} onPress={_ => this.goBack()}>
              <Icon name="chevron-left" />
            </Button>
          </Left>
          <Body>
            <Text>{I18n.t("onboarding.tos.headerTitle")}</Text>
          </Body>
        </AppHeader>
        {this.renderContent(pinState)}
        {this.renderFooter(pinState)}
      </Container>
    );
  }
}

const mapStateToProps = (state: GlobalState): ReduxMappedProps => ({
  // Checks from the store whether there was an error while creating the PIN (e.g. saving into the Keystore)
  pinSaveError: createErrorSelector(["PIN_CREATE"])(state)
});

export default connect(mapStateToProps)(PinScreen);
