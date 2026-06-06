<Screen
  id="verifyPage"
  _customShortcuts={[]}
  _hashParams={[]}
  _order={6}
  _searchParams={[]}
  browserTitle={null}
  title={null}
  urlSlug={null}
  uuid="ab117d9f-c308-4519-88d3-62c59a6d918a"
>
  <SqlQueryUnified
    id="verifyAccount"
    query={include("../lib/verifyAccount.sql", "string")}
    resourceDisplayName="forge_supabase_shadow"
    resourceName="c0942fb7-65d1-47f2-8be1-799b346afe64"
    resourceTypeOverride=""
    showFailureToaster={false}
    warningCodes={[]}
  />
  <Frame
    id="$main7"
    enableFullBleed={false}
    isHiddenOnDesktop={false}
    isHiddenOnMobile={false}
    padding="8px 12px"
    sticky={null}
    type="main"
  >
    <Image
      id="image6"
      heightType="fixed"
      horizontalAlign="center"
      retoolStorageFileId="2939f030-8450-435d-9363-ccd927bb0387"
      src="https://picsum.photos/id/1025/800/600"
      srcType="retoolStorageFileId"
    />
    <Container
      id="container14"
      footerPadding="4px 12px"
      headerPadding="4px 12px"
      padding="12px"
      showBody={true}
      showHeader={true}
    >
      <Header>
        <Text
          id="containerTitle11"
          horizontalAlign="center"
          value="#### FORGE Logic™ Account Verification"
          verticalAlign="center"
        />
      </Header>
      <View id="00030" viewKey="View 1">
        <Text
          id="verifyMessage"
          horizontalAlign="center"
          value="{{ {
  ok: '✅ Your email is verified. You can now sign in.',
  invalid: '⚠️ This verification link is invalid. Please check the link or request a new one.',
  already_used: 'ℹ️ This link has already been used. If your account is verified, you can sign in.',
  expired: '⚠️ This verification link has expired. Please request a new verification email.'
}[verifyAccount.data.status[0]] || 'Verifying your account…' }}"
          verticalAlign="center"
        />
        <Button
          id="goToLoginButton"
          hidden="{{ verifyAccount.data.status[0] !== 'ok' }}"
          text="Go to sign in"
        >
          <Event
            id="4c9f79ad"
            event="click"
            method="openPage"
            params={{
              options: { map: { passDataWith: "urlParams" } },
              pageName: "loginPage",
            }}
            pluginId=""
            type="util"
            waitMs="0"
            waitType="debounce"
          />
        </Button>
      </View>
    </Container>
  </Frame>
</Screen>
