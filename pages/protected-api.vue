<template>
  <div>{{ response.message }}</div>
</template>

<script>
export default {
  async asyncData({ app }) {
    const response = await app.$axios.$get(
      'http://localhost:4000/api/protected'
    )
    return { response }
  }
}
</script>
