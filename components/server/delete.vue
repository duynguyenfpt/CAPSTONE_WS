<template>
  <div>
    <b-modal no-close-on-backdrop v-model="isVisible" title="Confirm" hide-footer>
      <b-row>
        <b-col>
          <p>Do you want to delete this server?</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="danger" @click="onDelete">
            <b-spinner v-if="isLoading" variant="danger" small></b-spinner
            >Delete</b-button
          >
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import { deleteServer } from '@/service/server'
import { checkPermission } from '~/service/right'
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
        path: 'server_infor'
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
    async onDelete () {
      try {
        this.isLoading = true
        const res = await deleteServer(this.idItem)
        if (res.code === '200') {
          this.$emit('onDeleted')
          if (res.code) {
            this.$notify({ type: 'success', text: 'Delete server succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Delete server failed' })
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Delete server failed' })
      } finally {
        this.isLoading = false
        this.isVisible = false
      }
    }
  }
}
</script>

<style></style>
