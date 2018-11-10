import { keycloakClient } from '~/plugins/keycloak'

export default function() {
  return keycloakClient.getUser().then(user => {
    if (user == null) {
      keycloakClient.signinRedirect()
      return new Promise(resolve => {
        // Wait for broswer to redirect...
      })
    }
  })
}
