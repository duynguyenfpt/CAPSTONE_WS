<template>
  <div>
    <b-modal no-close-on-backdrop v-model="isVisible" title="Detail Right" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab">Path</label>
          </b-col>
          <b-col>
            <b-form-input
              size="sm"
              v-model="config.path"
              disabled
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="text-center">Method</label>
          </b-col>
          <b-col>
            <b-form-input
              size="sm"
              v-model="config.method"
              disabled
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="text-center">Description</label>
          </b-col>
          <b-col>
            <b-form-input
              size="sm"
              v-model="config.description"
              disabled
            ></b-form-input>
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
import { checkPermission, detailRight } from '@/service/right'
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
      const data = {
        method: 'GET',
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
        this.isLoading = true
        try {
          const res = await detailRight(this.idItem)
          if (res.code === '200') {
            this.config = res.data
            this.isLoading = false
          } else {
            this.$notify({
              type: 'error',
              text: 'Error occurred!  '
            })
            this.isVisible = false
          }
        } catch {
          this.$notify({
            type: 'error',
            text: 'Error occurred!  '
          })
          this.isVisible = false
        }
      }
    },
    onClose () {
      this.isVisible = false
    }
  }
}
</script>

<style></style>
