<template>
  <div/>
</template>

<script>
import { keycloakClient } from '~/plugins/keycloak'

export default {
  mounted() {
    keycloakClient
      .signinRedirectCallback()
      .then(() => keycloakClient.getUser().then(user => console.log(user)))
      .then(() => this.$router.push({ path: '/' }))
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
