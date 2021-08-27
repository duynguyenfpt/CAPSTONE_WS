<template>
<div>
  <b-modal v-model="isVisible" title="Confirm" hide-footer>
      <b-row>
        <b-col>
          <p>Do you want to active for this account?</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="info" @click="onActive">
            <b-spinner v-if="isLoading" variant="info" small></b-spinner>Active</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
  </b-modal>
</div>
</template>

<script>
import { activeAccount } from '@/service/account'
export default {
  data: () => ({
    isVisible: false,
    idItem: 0,
    isLoading: false
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
    },
    onClose () {
      this.isVisible = false
    },
    async onActive () {
      try {
        this.isLoading = true
        const active = {
          active: true
        }
        const res = await activeAccount(this.idItem, active)
        if (res.statusCode === '403') {
          this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
          this.isLoading = false
          this.isVisible = false
        } else {
          this.$emit('onActived')
          if (res.code === '200') {
            this.$notify({ type: 'success', text: 'Active account succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Active account  failed' })
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoading = false
        this.isVisible = false
      }
    }
  }
}
</script>

<style></style>
