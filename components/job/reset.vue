<template>
  <div>
    <b-modal no-close-on-backdrop v-model="isVisible" title="Confirm" hide-footer>
      <b-row>
        <b-col>
          <p>Do you want to reset counter for this job?</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="warning" @click="onReset">
            <b-spinner v-if="isLoading" variant="warning" small></b-spinner
            >Reset counter</b-button
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
import { resetJob } from '@/service/job'
import { checkPermission } from '@/service/right'
export default {
  data: () => ({
    isVisible: false,
    idItem: 0,
    isLoading: false
  }),
  methods: {
    async show (id) {
      const data = {
        method: 'POTS',
        path: 'reset_job'
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
    async onReset () {
      try {
        this.isLoading = this.idItem
        const res = await resetJob(this.idItem)
        this.$emit('onReseted')
        if (res.code === '200') {
          this.$notify({ type: 'success', text: 'Reset counter succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Reset counter failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Reset counter failed' })
      } finally {
        this.isLoading = false
        this.isVisible = false
      }
    }
  }
}
</script>

<style></style>
