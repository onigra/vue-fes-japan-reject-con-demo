<template>
  <div/>
</template>

<script>
import { keycloakClient } from '~/plugins/keycloak'

export default {
  mounted() {
    keycloakClient
      .signinSilentCallback()
      .then(() => keycloakClient.getUser().then(user => console.log(user)))
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
