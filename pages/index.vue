<template>
  <section class="container">
    <div>
      <h1 class="title">
        demo
      </h1>

      <div class="links">
        <router-link
          to="/"
          @click.native="signup"
        >
          <span>Signup</span>
        </router-link>
        <router-link
          to="/"
          @click.native="login"
        >
          <span>Login</span>
        </router-link>
        <router-link
          to="/"
          @click.native="logout"
        >
          <span>Logout</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { keycloakClient, signupUrl } from '~/plugins/keycloak'

export default {
  methods: {
    login() {
      keycloakClient.signinRedirect().catch(err => {
        console.log(err)
      })
    },
    logout() {
      keycloakClient
        .signoutRedirect()
        .then(res => {
          console.log('logout', res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    signup() {
      window.location.href = signupUrl()
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.links {
  padding-top: 15px;
}
</style>
