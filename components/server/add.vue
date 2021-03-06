<template>
  <div>
    <b-modal no-close-on-backdrop v-model="isVisible" title="Create Server" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row>
          <b-col>
            <label class="form-label">Server Host <span class="msg-error">*</span></label>
            <b-input size="sm" v-model="serverHost" />
            <p class="msg-error" v-if="msg.host">{{ msg.host }}</p>
            <label class="form-label">Server Domain <span class="msg-error">*</span></label>
            <b-input size="sm" v-model="serverDomain" />
            <p class="msg-error" v-if="msg.domain">{{ msg.domain }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-3">
          <b-col class="text-right">
            <b-button size="sm" variant="primary" @click="onCreateServer">
              <b-spinner
                v-if="isLoadingCreate"
                variant="primary"
                small
              ></b-spinner
              >Create</b-button
            >
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
import { createServer } from '@/service/server'
import { checkPermission } from '~/service/right'
export default {
  data () {
    return {
      serverHost: null,
      serverDomain: null,
      isVisible: false,
      isLoading: false,
      isLoadingCreate: false,
      msg: {
        host: null,
        domain: null
      }
    }
  },
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
        this.msg.domain = 'Invalid server domain'
      }
    },
    validateHost (value) {
      if (
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          value
        )
      ) {
        this.msg.host = ''
      } else {
        this.msg.host = 'Invalid server host'
      }
    },
    async show () {
      const data = {
        method: 'POST',
        path: 'server_infor'
      }
      const res = await checkPermission(data)
      if (!res.data.success) {
        this.$notify({
          type: 'error',
          text: 'Error occurred! - Access Denied'
        })
      } else {
        this.isVisible = true
        this.serverHost = null
        this.serverDomain = null
        this.msg.host = null
        this.msg.domain = null
      }
    },
    onClose () {
      this.isVisible = false
    },
    async onCreateServer () {
      this.validateHost(this.serverHost)
      this.validateDomain(this.serverDomain)
      if (this.serverHost === null) {
        this.msg.host = 'Invalid server host'
      }
      if (this.serverDomain === null) {
        this.msg.domain = 'Invalid server domain'
      }
      if (this.msg.host === '' && this.msg.domain === '') {
        try {
          this.isLoadingCreate = true
          const config = {
            serverHost: this.serverHost,
            serverDomain: this.serverDomain
          }
          const data = await createServer(config)
          this.isLoadingCreate = false
          this.isVisible = false
          this.$emit('onAdded', data)
          if (data.code === '201') {
            this.$notify({ type: 'success', text: 'Add server succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Add server failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Add server failed' })
        } finally {
          this.isLoadingCreate = false
          this.isVisible = false
        }
      }
    }
  }
}
</script>
