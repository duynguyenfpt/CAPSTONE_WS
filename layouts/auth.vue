<template>
  <div class="vue-tempalte">
    <nuxt class="content" />
    <notifications :duration="5000" />
  </div>
</template>
<script>
export default {
  name: 'auth'
}
</script>
