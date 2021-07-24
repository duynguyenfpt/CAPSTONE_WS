<template>
<div>
  <b-modal v-model="isVisible" title="Confirm" hide-footer>
      <b-row>
        <b-col>
<<<<<<< HEAD
          <p>Do you want to delete this right?</p>
=======
          <p>Do you want to reset password for this account?</p>
>>>>>>> 18ae17e9fc2ecc63ac229320c7d6fed7db894c44
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
<<<<<<< HEAD
          <b-button size="sm" variant="danger" @click="onDeleteRight">
            <b-spinner v-if="isLoading" variant="danger" small></b-spinner>Delete</b-button>
=======
          <b-button size="sm" variant="danger" @click="onReset">
            <b-spinner v-if="isLoading" variant="danger" small></b-spinner>Reset</b-button>
>>>>>>> 18ae17e9fc2ecc63ac229320c7d6fed7db894c44
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
  </b-modal>
</div>
</template>

<script>
<<<<<<< HEAD
import { deleteRight } from '@/service/right'
=======
import { resetAccount } from '@/service/account'
>>>>>>> 18ae17e9fc2ecc63ac229320c7d6fed7db894c44
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
<<<<<<< HEAD
    async onDeleteRight () {
      try {
        this.isLoading = true
        const res = await deleteRight(this.idItem)
        this.$emit('onDeleted')
        if (res.code) {
          this.$notify({ type: 'success', text: 'Delete right succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Delete right failed' })
=======
    async onReset () {
      try {
        this.isLoading = this.idItem
        const res = await resetAccount(this.idItem)
        this.$emit('onReseted')
        if (res.code === '200') {
          this.$notify({ type: 'success', text: 'Reset password succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Reset password  failed' })
>>>>>>> 18ae17e9fc2ecc63ac229320c7d6fed7db894c44
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
