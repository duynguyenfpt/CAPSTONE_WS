<template>
  <b-modal v-model="isVisible" title="Detail Right" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <label class="form-label">Right Code</label>
          <b-input size="sm" v-model="config.code" disabled />
          <label class="form-label">Right Name</label>
          <b-input size="sm" v-model="config.name" disabled/>
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
export default {
  data: () => ({
    config: {
      code: null,
      name: null
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
      this.isLoading = false
    },
    onClose () {
      this.isVisible = false
    }
  }
}
</script>

<style></style>
