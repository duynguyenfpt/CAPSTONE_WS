<template>
<div>
  <b-modal no-close-on-backdrop v-model="isVisible" title="Confirm" hide-footer>
      <b-row>
        <b-col>
          <p>Do you want to delete this right?</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="danger" @click="onDeleteRight">
            <b-spinner v-if="isLoading" variant="danger" small></b-spinner>Delete</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
  </b-modal>
</div>
</template>

<script>
import { checkPermission, deleteRight } from '@/service/right'
export default {
  data: () => ({
    isVisible: false,
    idItem: 0,
    isLoading: false
  }),
  methods: {
    async show (id) {
      const data = {
        method: 'DELETE',
        path: 'right'
      }
      const res = await checkPermission(data)
      if (!res.data.success) {
        this.$notify({
          type: 'error',
          text: 'Error occurred! - Access Denied'
        })
      } else {
        this.idItem = id
        this.isVisible = true
      }
    },
    onClose () {
      this.isVisible = false
    },
    async onDeleteRight () {
      try {
        this.isLoading = true
        const res = await deleteRight(this.idItem)
        this.$emit('onDeleted')
        if (res.code === '200') {
          this.$notify({ type: 'success', text: 'Delete right succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Delete right failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Delete right failed' })
      } finally {
        this.isLoading = false
        this.isVisible = false
      }
    }
  }
}
</script>

<style></style>
