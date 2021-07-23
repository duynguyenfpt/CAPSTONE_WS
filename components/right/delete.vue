<template>
<div>
  <b-modal v-model="isVisible" title="Confirm" hide-footer>
      <b-row>
        <b-col>
          <p>Do you want to reset password for this account?</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="danger" @click="onReset">
            <b-spinner v-if="isLoading" variant="danger" small></b-spinner>Reset</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
  </b-modal>
</div>
</template>

<script>
import { resetAccount } from '@/service/account'
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
    async onReset () {
      try {
        this.isLoading = this.idItem
        const res = await resetAccount(this.idItem)
        this.$emit('onReseted')
        if (res.code === '200') {
          this.$notify({ type: 'success', text: 'Reset password succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Reset password  failed' })
          this.$router.go()
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
