<template>
  <div>
    <a-input-number v-model="a"></a-input-number>
    +
    <a-input-number v-model="b"></a-input-number>
    <a-button @click="calcSum">=</a-button>

    {{ sum }}
  </div>
</template>

<script>
import { add } from '@/services/number'

export default {
  data: () => ({
    a: 0,
    b: 0,
    sum: 0,
  }),
  created() {
    this.a = 10
    this.b = 20
    this.calcSum()
  },
  methods: {
    calcSum() {
      this.sum = add(this.a, this.b)
    },
  },
}
</script>

<style></style>
