<Container
  id="containerSignUp"
  footerPadding="4px 12px"
  headerPadding="4px 12px"
  padding="12px"
  showBody={true}
  showHeader={true}
  style={{ map: { border: "secondary" } }}
>
  <Header>
    <Text
      id="titleSignUpPage"
      horizontalAlign="center"
      value="#### FORGE Logic™ Sign-up Page"
      verticalAlign="center"
    />
  </Header>
  <View id="00030" viewKey="View 1">
    <TextInput
      id="signUpFullname"
      iconBefore="bold/phone-contact-phone-book"
      label="Full name"
      labelPosition="top"
      placeholder="Enter name"
    />
    <TextInput
      id="signUpEmail"
      iconBefore="bold/mail-send-envelope"
      label="Email"
      labelPosition="top"
      patternType="email"
      placeholder="you@example.com"
      style={{ map: { placeholder: "canvas" } }}
    />
    <PasswordInput
      id="signUpPassword"
      iconBefore="bold/programming-browser-key"
      label="Password"
      labelPosition="top"
      placeholder="••••••••••"
      showTextToggle={true}
    />
    <TextInput
      id="signUpOrgName"
      iconBefore="bold/shopping-store-factory-building"
      label="Organisation name"
      labelPosition="top"
      placeholder="Enter value"
    />
    <Button id="signUpButton" text="Create account">
      <Event
        id="0654ff86"
        event="click"
        method="trigger"
        params={{}}
        pluginId="validateSignup"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
  </View>
</Container>
