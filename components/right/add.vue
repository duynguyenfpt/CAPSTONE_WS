<template>
  <div>
    <b-modal v-model="isVisible" title="Create Right" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab">Path</label>
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="path"></b-form-input>
            <p class="msg-error" v-if="msg.path">{{ msg.path }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="text-center">Method</label>
          </b-col>
          <b-col>
            <b-form-select
              v-model="method"
              :options="opsMethod"
              size="sm"
              @change="chooseMethod"
            ></b-form-select>
            <p class="msg-error" v-if="msg.method">{{ msg.method }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab">Description</label>
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="description"></b-form-input>
            <p class="msg-error" v-if="msg.description">{{ msg.description }}</p>
          </b-col>
        </b-row>
        <b-row class="text-center pt-3">
          <b-col class="text-right">
            <b-button @click="addRight" variant="primary" size="sm"
              >
              <b-spinner v-if="isLoadingCreate" variant="primary" small></b-spinner>
              Add right</b-button
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
import { createRight } from '@/service/right'
export default {
  props: {
    database: {}
  },
  data: () => ({
    isLoading: false,
    path: null,
    method: null,
    description: null,
    isVisible: false,
    isLoadingCreate: false,
    msg: {
      path: null,
      method: null,
      description: null
    },
    opsMethod: [
      { value: null, text: 'Please select a method' },
      { value: 'GET', text: 'GET' },
      { value: 'POST', text: 'POST' },
      { value: 'PUT', text: 'PUT' },
      { value: 'DELETE', text: 'DELETE' }
    ]
  }),
  watch: {
    path (value) {
      this.path = value
      this.validatePath(value)
    },
    description (value) {
      this.description = value
      this.validateDescription(value)
    }
  },
  methods: {
    validatePath (value) {
      if (/^[a-zA-Z0-9_.-]{1,127}$/.test(value)) {
        this.msg.path = ''
      } else {
        this.msg.path = 'Invalid path'
      }
    },
    validateDescription (value) {
      if (value !== '' && value !== null) {
        this.msg.description = ''
      } else {
        this.msg.description = 'Invalid description'
      }
    },
    chooseMethod () {
      if (this.method === null) {
        this.msg.method = 'Please select a method'
      } else {
        this.msg.method = ''
      }
    },
    async show () {
      this.isVisible = true
      this.isLoading = true
      this.path = null
      this.method = null
      this.description = null
      this.isLoading = false
      this.isLoadingCreate = false
      this.msg = {
        path: null,
        method: null,
        description: null
      }
    },
    onClose () {
      this.isVisible = false
    },
    async addRight () {
      this.validatePath(this.path)
      this.chooseMethod()
      this.validateDescription(this.description)
      if (this.method === null) {
        this.msg.method = 'Please select a method'
      }
      if (this.path === null) {
        this.msg.path = 'Invalid path'
      }
      if (this.description === null) {
        this.msg.description = 'Invalid description'
      }
      if (this.msg.method === '' && this.msg.path === '' && this.msg.description === '') {
        try {
          this.isLoadingCreate = true
          const body = {
            path: this.path,
            method: this.method,
            description: this.description
          }
          const res = await createRight(body)
          if (res.statusCode === '403') {
            this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
            this.isVisible = false
          } else {
            this.$emit('onAdded')
            if (res.code === '201') {
              this.$notify({ type: 'success', text: 'Add right succeeded' })
            } else {
              this.$notify({ type: 'error', text: 'Add right failed' })
            }
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        } finally {
          this.loading = false
          this.isVisible = false
        }
      }
    }
  }
}
</script>

<style></style>
