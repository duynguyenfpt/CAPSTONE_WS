<template>
<div>
  <b-modal v-model="isVisible" title="Update Server" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <slabel class="form-label">Server Host</slabel>
          <b-input size="sm" v-model="serverHost" />
          <p class="msg-error" v-if="msg.host">{{ msg.host }}</p>
          <label class="form-label">Server Domain</label>
          <b-input size="sm" v-model="serverDomain" />
          <p class="msg-error" v-if="msg.domain">{{ msg.domain }}</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="primary" @click="onUpdateServer">
            <b-spinner v-if="isLoadingUpdate" variant="primary" small></b-spinner>Update</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
  </div>
</template>

<script>
import { getServer, updateServer } from '@/service/server'
export default {
  data: () => ({
    serverHost: null,
    serverDomain: null,
    isVisible: false,
    idItem: 0,
    isLoading: false,
    isLoadingUpdate: false,
    msg: {
      host: null,
      domain: null
    }
  }),
  watch: {
    serverHost (value) {
      this.serverHost = value
      this.validateHost(value)
    },
    serverDomain (value) {
      this.serverDomain = value
      this.validateDomain(value)
    }
  },
  methods: {
    validateDomain (value) {
      if (/^[a-zA-Z0-9][a-zA-Z0-9.-]+[a-zA-Z0-9]$/.test(value)) {
        this.msg.domain = ''
      } else {
        this.msg.domain = 'Invalid server host'
      }
    },
    validateHost (value) {
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)) {
        this.msg.host = ''
      } else {
        this.msg.host = 'Invalid server domain'
      }
    },
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = await getServer(this.idItem)
      if (res.statusCode === '403') {
        this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
        this.isVisible = false
        this.isLoading = false
      } else {
        this.serverHost = res.data.serverHost
        this.serverDomain = res.data.serverDomain
        this.isLoading = false
        this.msg.domain = null
        this.msg.host = null
      }
    },
    onClose () {
      this.isVisible = false
    },
    async onUpdateServer () {
      if (this.msg.host === '' && this.msg.domain === '') {
        try {
          this.isLoadingUpdate = true
          const config = {
            serverHost: this.serverHost,
            serverDomain: this.serverDomain
          }
          const data = await updateServer(this.idItem, config)
          if (data.statusCode === '403') {
            this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
            this.isLoadingUpdate = false
            this.isVisible = false
          } else {
            this.isLoadingUpdate = false
            this.isVisible = false
            this.$emit('onUpdated', data)
            if (data.code === '200') {
              this.$notify({ type: 'success', text: 'Update server succeeded' })
            } else {
              this.$notify({ type: 'error', text: 'Update server failed' })
            }
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        } finally {
          this.isLoadingUpdate = false
          this.isVisible = false
        }
      }
    }
  }
}
</script>

<style></style>
