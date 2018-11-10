const keycloakUrl = 'http://localhost:8080/auth'
const keycloakRealm = 'demo'
const keycloakClientId = 'demo-browser-client'

export default function({ $axios }) {
  $axios.interceptors.request.use(config => {
    const currentUser = JSON.parse(
      window.sessionStorage.getItem(
        `oidc.user:${keycloakUrl}/realms/${keycloakRealm}:${keycloakClientId}`
      )
    )
    config.headers.Authorization = `Bearer ${currentUser.access_token}`
    return config
  })
}
