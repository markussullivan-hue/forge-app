<Container
  id="loginCardContainer"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="24px"
  showBody={true}
  style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
>
  <View id="00030" viewKey="View 1">
    <Text id="loginTitleText" value="## FORGE Logic" verticalAlign="center" />
    <Text
      id="loginSubtitleText"
      value="Sign in to continue"
      verticalAlign="center"
    />
    <TextInput
      id="emailInput"
      label=""
      labelPosition="top"
      patternType="email"
      placeholder="Email address"
      required={true}
      validationMessage="Enter your email address."
    >
      <Event
        id="042a3baa"
        event=""
        method="run"
        params={{
          map: {
            src: "// Hide the login error as the user updates the input.\nloginErrorText.setHidden(true)\nloginErrorText.setValue('')",
          },
        }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
    </TextInput>
    <PasswordInput
      id="passwordInput"
      label=""
      labelPosition="top"
      minLength={1}
      placeholder="Password"
      required={true}
      showClear={true}
      showTextToggle={true}
      validationMessage="Enter your password."
    >
      <Event
        id="865e51a0"
        event=""
        method="run"
        params={{
          map: {
            src: "// Hide the login error as the user updates the input.\nloginErrorText.setHidden(true)\nloginErrorText.setValue('')",
          },
        }}
        pluginId=""
        type="script"
        waitMs="0"
        waitType="debounce"
      />
    </PasswordInput>
    <Button
      id="signInButton"
      ariaLabel="Sign in"
      disabled="{{ emailInput.invalid || passwordInput.invalid || !emailInput.value || !passwordInput.value }}"
      loading="{{ authenticateUser.isFetching }}"
      text="Sign in"
    >
      <Event
        id="76f3a2c9"
        event="click"
        method="trigger"
        params={{}}
        pluginId="authenticateUser"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Text id="loginErrorText" hidden={true} verticalAlign="center" />
    <Link id="forgotPasswordLink" disabled={true} text="Forgot password?" />
  </View>
</Container>
