<template>
  <b-form-select size="sm" class="form-input" v-model="option" :options="list"/>
</template>

<script>
import { getAllDbType } from '../../service/db'

export default {
  props: {
    value: {}
  },

  data: () => ({
    list: [],
    option: null
  }),

  watch: {
    option (newValue, oldValue) {
      this.$emit('input', newValue)
    }
  },

  created () {
    this.getListDBType()
  },

  methods: {
    async getListDBType () {
      try {
        const res = await getAllDbType()

        this.list = res.data.map(e => ({ value: e.code, text: e.name }))
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style></style>
