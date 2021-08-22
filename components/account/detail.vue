<template>
<div>
  <b-modal v-model="isVisible" title="Detail Account" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <label class="form-label">Username</label>
          <b-input size="sm" v-model="config.username" disabled />
          <label class="form-label">Email</label>
          <b-input size="sm" v-model="config.email" disabled/>
          <label class="form-label">Role</label>
          <b-input size="sm" v-model="config.role" disabled/>
          <label class="form-label">Phone</label>
          <b-input size="sm" v-model="config.phone" disabled/>
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
</div>
</template>

<script>
import { getAccountDetail } from '@/service/account'
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
    isLoading: false
  }),

  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = await getAccountDetail(this.idItem)
      if (res.statusCode === '403') {
        this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
        this.isVisible = false
      } else {
        this.config = res.data
        if (this.config.role === 'admin') {
          this.config.role = 'Admin'
        }
        if (this.config.role === 'viewer') {
          this.config.role = 'Viewer'
        }
        if (this.config.role === 'engineer') {
          this.config.role = 'Engineer'
        }
        this.isLoading = false
      }
    },
    onClose () {
      this.isVisible = false
    }
  }
}
</script>

<style></style>
