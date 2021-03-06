<template>
  <div>
    <b-modal no-close-on-backdrop v-model="isVisible" title="Edit Right" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab">Path <span class="msg-error">*</span></label>
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="path"></b-form-input>
            <p class="msg-error" v-if="msg.path">{{ msg.path }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="text-center">Method <span class="msg-error">*</span></label>
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
            <label class="form-lab">Description <span class="msg-error">*</span></label>
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="description"></b-form-input>
            <p class="msg-error" v-if="msg.description">
              {{ msg.description }}
            </p>
          </b-col>
        </b-row>
        <b-row class="pt-3">
          <b-col class="text-right">
            <b-button size="sm" variant="primary" @click="onUpdateRight">
              <b-spinner
                v-if="isLoadingUpdate"
                variant="primary"
                small
              ></b-spinner
              >Update</b-button
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
import { checkPermission, detailRight, updateRight } from '@/service/right'

export default {
  data: () => ({
    path: null,
    method: null,
    description: null,
    isVisible: false,
    idItem: 0,
    isLoading: false,
    isLoadingUpdate: false,
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
    async show (id) {
      const dataGet = {
        method: 'GET',
        path: 'right'
      }
      const resGet = await checkPermission(dataGet)
      const dataPut = {
        method: 'PUT',
        path: 'right'
      }
      const resPut = await checkPermission(dataPut)
      if (!resGet.data.success || !resPut.data.success) {
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
            this.method = res.data.method
            this.path = res.data.path
            this.description = res.data.description
            this.isLoading = false
            this.msg = {
              path: null,
              method: null,
              description: null
            }
            this.isLoadingUpdate = false
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
    },
    async onUpdateRight () {
      this.validatePath(this.path)
      this.chooseMethod()
      this.validateDescription(this.description)
      if (this.method === null) {
        this.msg.method = 'Please select a method'
      }
      if (this.description === null) {
        this.msg.description = 'Invalid description'
      }
      if (this.path === null) {
        this.msg.path = 'Invalid path'
      }
      if (
        this.msg.method === '' &&
        this.msg.path === '' &&
        this.msg.description === ''
      ) {
        try {
          this.isLoadingUpdate = true
          const body = {
            path: this.path,
            method: this.method,
            description: this.description
          }
          const res = await updateRight(this.idItem, body)
          this.$emit('onUpdated', res.data)
          if (res.code === '200') {
            this.$notify({ type: 'success', text: 'Update right succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Update right failed' })
          }
        } catch (e) {
          this.$notify({
            type: 'error',
            text: 'Error occurred!'
          })
          this.isVisible = false
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
