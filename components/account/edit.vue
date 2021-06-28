<template>
  <b-modal v-model="isVisible" title="Edit Account" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <label class="form-label">Username</label>
          <b-input size="sm" v-model="config.username" />
          <label class="form-label">Email</label>
          <b-input size="sm" v-model="config.email" />
          <label class="form-label">Role</label>
          <b-input size="sm" v-model="config.role" />
          <label class="form-label">Phone</label>
          <b-input size="sm" v-model="config.phone" />
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="primary" @click="onUpdateAcc">
            <b-spinner v-if="isLoadingUpdate" variant="primary" small></b-spinner>Update</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
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
      username: null,
      email: null,
      phone: null,
      role: null
    },
    isVisible: false,
    idItem: 0,
    isLoading: false,
    isLoadingUpdate: false
  }),

  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      this.config.username = 'Linh'
      this.config.email = 'Linh'
      this.config.phone = 'Linh'
      this.config.role = 'Linh'
      this.isLoading = false
    },
    onClose () {
      this.isVisible = false
    },
    async onUpdateAcc () {
      try {
        this.isLoadingUpdate = true
        const data = true
        this.isLoadingUpdate = false
        this.isVisible = false
        this.$emit('onUpdated', data)
        if (data.code) {
          this.$notify({ type: 'success', text: 'Update account succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Update account failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    }
  }
}
</script>

<style></style>
