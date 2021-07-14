<template>
  <div>
    <h3>Token is: {{ data}}</h3>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: 'ssss'
    }
  },
  mounted () {
    this.data = this.$store.state.auth.token
    console.log(this.$store.state.auth.token)
  }
}
</script>
