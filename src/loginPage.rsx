<Screen
  id="loginPage"
  _customShortcuts={[]}
  _hashParams={[]}
  _order={4}
  _searchParams={[]}
  browserTitle="Login"
  title="Login"
  urlSlug="login"
  uuid="292c0688-f187-4e7f-827a-b927fd03db6d"
>
  <JavascriptQuery
    id="authenticateUser"
    isMultiplayerEdited={false}
    notificationDuration={4.5}
    query={include("../lib/authenticateUser.js", "string")}
    resourceName="JavascriptQuery"
    showSuccessToaster={false}
  >
    <Event
      id="bffc2025"
      event="success"
      method="openPage"
      params={{
        options: { map: { passDataWith: "urlParams" } },
        pageName: "dashboardPage",
      }}
      pluginId=""
      type="util"
      waitMs="0"
      waitType="debounce"
    />
    <Event
      id="5c9a879d"
      event="failure"
      method="setHidden"
      params={{}}
      pluginId="loginErrorText"
      type="widget"
      waitMs="0"
      waitType="debounce"
    />
  </JavascriptQuery>
  <SqlQueryUnified
    id="checkCredentials"
    query={include("../lib/checkCredentials.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    runWhenModelUpdates={false}
    warningCodes={[]}
  />
  <Frame
    id="$main5"
    enableFullBleed={false}
    isHiddenOnDesktop={false}
    isHiddenOnMobile={false}
    padding="8px 12px"
    sticky={null}
    type="main"
  >
    <Container
      id="loginBackgroundContainer"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="24px"
      showBody={true}
      showBorder={false}
      style={{ border: "surfacePrimaryBorder", borderRadius: "8px" }}
    >
      <View id="00030" viewKey="View 1">
        <Image
          id="forgeLogicImage"
          heightType="fixed"
          horizontalAlign="center"
          retoolStorageFileId="2939f030-8450-435d-9363-ccd927bb0387"
          src="https://picsum.photos/id/1025/800/600"
          srcType="retoolStorageFileId"
        />
        <Include src="./loginCardContainer.rsx" />
      </View>
    </Container>
  </Frame>
</Screen>
