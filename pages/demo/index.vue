<template>
  <div>
      <a-input-number v-model="a"/>
      +
      <a-input-number v-model="b"/>
      <a-button @click="add">=</a-button>
      {{c}}
  </div>
</template>

<script>
export default {
  data: () => ({
    a: 10,
    b: 10,
    c: 0
  }),
  methods: {
    add () {
      this.c = this.a + this.b
    }
  }
}
</script>

<style>

</style>
