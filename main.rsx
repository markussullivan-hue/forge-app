<App>
  <Include src="./functions.rsx" />
  <Include src="./src/CharterGenerationPage.rsx" />
  <CustomAppTheme
    id="$appTheme"
    _migrated={true}
    automatic={[
      "#141419",
      "#232229",
      "#2a2833",
      "#31303a",
      "#4b4a51",
      "#e5e6eb",
      "#a0a1a8",
      "#6a6b72",
      "#35343e",
      "#878890",
      "#c8c8cd",
      "#a14e57",
      "#b65b65",
      "#f5f6f8",
      "#4e7a68",
      "#5b8d79",
      "#8ea4d2",
      "#c9962a",
      "#d6aa47",
      "#a97a1f",
      "#282832",
      "#bebdc2",
      "#fde68a",
      "#eecff3",
      "#fecaca",
    ]}
    borderRadius={0}
    canvas="#000000"
    danger="#fd021f"
    defaultFont={{ size: "12px", fontWeight: "400" }}
    h1Font={{ size: "36px", fontWeight: "700" }}
    h2Font={{ size: "28px", fontWeight: "700" }}
    h3Font={{ size: "24px", fontWeight: "700" }}
    h4Font={{ size: "18px", fontWeight: "700" }}
    h5Font={{ size: "16px", fontWeight: "700" }}
    h6Font={{ size: "14px", fontWeight: "700" }}
    highlight="#fde68a"
    info="#c56a39"
    labelEmphasizedFont={{ size: "12px", fontWeight: "600" }}
    labelFont={{ size: "12px", fontWeight: "500" }}
    primary="#f2c83b"
    secondary="#e5e4e2"
    success="#488169"
    surfacePrimary="#000000"
    surfacePrimaryBorder=""
    surfaceSecondary="#000000"
    surfaceSecondaryBorder=""
    tertiary="#e5e4e2"
    textDark="#141419"
    textLight="#e5e4e2"
    warning="#f2c83b"
  />
  <Include src="./src/FORGECharterGenerationWizard.rsx" />
  <Include src="./src/dashboardPage.rsx" />
  <AppStyles id="$appStyles" css={include("./lib/$appStyles.css", "string")} />
  <Include src="./src/GovernanceReviewPage.rsx" />
  <Include src="./src/loginPage.rsx" />
  <Include src="./src/signUpPage.rsx" />
  <Include src="./src/verifyPage.rsx" />
</App>
