<template>
  <div/>
</template>

<script>
import { keycloakClient } from '~/plugins/keycloak'

export default {
  mounted() {
    keycloakClient
      .signoutRedirectCallback()
      .then(() => this.$router.push({ path: '/' }))
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
