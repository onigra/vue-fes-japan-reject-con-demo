import { UserManager, Log } from 'oidc-client'
import KeycloakSignupUrl from 'keycloak-signup-url'

if (process.env.NODE_ENV === 'development') {
  Log.logger = console
}

const keycloakRealm = 'demo'
const keycloakUrl = 'http://localhost:8080/auth'
const keycloakClientId = 'demo-browser-client'
const keycloakScope = 'openid'

const keycloakClient = new UserManager({
  authority: keycloakUrl + '/realms/' + keycloakRealm,
  client_id: keycloakClientId,
  redirect_uri: window.location.origin + '/callback/login',
  response_type: 'id_token token',
  scope: keycloakScope,
  post_logout_redirect_uri: window.location.origin + '/callback/logout',
  loadUserInfo: true,
  authorization_endpoint: '/protocol/openid-connect/auth',
  userinfo_endpoint: '/protocol/openid-connect/userinfo',
  end_session_endpoint: '/protocol/openid-connect/logout',
  automaticSilentRenew: true,
  silent_redirect_uri: window.location.origin + '/callback/refresh'
})

keycloakClient.events.addSilentRenewError(() => {
  keycloakClient.signinRedirect().catch(err => {
    console.log(err)
  })
})

const keycloak = new KeycloakSignupUrl({
  realm: keycloakRealm,
  url: keycloakUrl,
  clientId: keycloakClientId,
  redirectUrl: window.location.origin + '/callback/signup'
})

export function signupUrl() {
  return keycloak.signupUrl()
}

export { keycloakClient }
