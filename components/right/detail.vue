<template>
  <b-modal v-model="isVisible" title="Detail Right" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col cols="4">
          <label class="form-lab">Path</label>
        </b-col>
        <b-col>
          <b-form-input size="sm" v-model="config.path" disabled></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <label class="text-center">Method</label>
        </b-col>
        <b-col>
          <b-form-input size="sm" v-model="config.method" disabled></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <label class="text-center">Description</label>
        </b-col>
        <b-col>
          <b-form-input size="sm" v-model="config.description" disabled></b-form-input>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="light" @click="onClose">
            Close
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import { detailRight } from '@/service/right'
export default {
  data: () => ({
    config: {
      path: null,
      method: null,
      description: null
    },
    isVisible: false,
    idItem: 0,
    isLoading: false
  }),

  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = await detailRight(this.idItem)
      this.config = res.data
      this.isLoading = false
    },
    onClose () {
      this.isVisible = false
    }
  }
}
</script>

<style></style>
