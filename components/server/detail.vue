<template>
  <div>
    <b-modal no-close-on-backdrop v-model="isVisible" title="Detail Server" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row>
          <b-col>
            <label class="form-label">Server Host</label>
            <b-input size="sm" v-model="config.serverHost" disabled />
            <label class="form-label">Server Domain</label>
            <b-input size="sm" v-model="config.serverDomain" disabled />
            <label class="form-label">Created Date</label>
            <b-input size="sm" v-model="config.createdDate" disabled />
            <label class="form-label">Created By</label>
            <b-input size="sm" v-model="config.createdBy" disabled />
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
import { getServer } from '@/service/server'
import moment from 'moment'
import { checkPermission } from '~/service/right'

export default {
  data: () => ({
    config: {
      serverHost: null,
      serverDomain: null,
      createdDate: null,
      createdBy: null
    },
    isVisible: false,
    idItem: 0,
    isLoading: false
  }),

  methods: {
    async show (id) {
      const data = {
        method: 'GET',
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
        this.isLoading = true
        try {
          const res = await getServer(this.idItem)
          if (res.code === '200') {
            this.config = res.data
            this.config.createdDate = moment(this.config.createdDate).format(
              'YYYY-MM-DD'
            )
            this.isLoading = false
          } else {
            this.$notify({
              type: 'error',
              text: 'Error occurred!'
            })
            this.isVisible = false
          }
        } catch (e) {
          this.$notify({
            type: 'error',
            text: 'Error occurred!'
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
