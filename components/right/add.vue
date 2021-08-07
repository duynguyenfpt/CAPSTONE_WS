<template>
  <div>
    <b-modal v-model="isVisible" title="Create Right" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row>
          <b-col cols="4">
            <label class="form-lab">Right Code</label>
          </b-col>
          <b-col>
            <b-input size="sm" v-model="code"></b-input>
            <p class="msg-error" v-if="msg.code">{{ msg.code }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="text-center">Right Name</label>
          </b-col>
          <b-col>
            <b-form-input
              size="sm"
              v-model="name"
            ></b-form-input>
            <p class="msg-error" v-if="msg.name">{{ msg.name }}</p>
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
    code: null,
    name: null,
    isVisible: false,
    isLoadingCreate: false,
    msg: {
      code: null,
      name: null
    }
  }),
  watch: {
    name (value) {
      this.name = value
      this.validateName(value)
    },
    code (value) {
      this.code = value
      this.validateCode(value)
    }
  },
  methods: {
    validateName (value) {
      if (/^[a-zA-Z0-9_.-]{1,127}$/.test(value)) {
        this.msg.name = ''
      } else {
        this.msg.name = 'Invalid right name'
      }
    },
    validateCode (value) {
      if (/^[a-zA-Z0-9_.-]{1,127}$/.test(value)) {
        this.msg.code = ''
      } else {
        this.msg.code = 'Invalid right code'
      }
    },
    async show () {
      this.isVisible = true
      this.isLoading = true
      this.code = null
      this.name = null
      this.isLoading = false
      this.isLoadingCreate = false
    },
    onClose () {
      this.isVisible = false
    },
    async addRight () {
      this.validateName(this.name)
      this.validateCode(this.code)
      if (this.code === null) {
        this.msg.code = 'Invalid right code'
      }
      if (this.name === null) {
        this.msg.name = 'Invalid right name'
      }
      if (this.msg.code === '' && this.msg.name === '') {
        try {
          this.isLoadingCreate = true
          const body = {
            code: this.code,
            rightName: this.name
          }
          const res = await createRight(body)
          this.$emit('onAdded')
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Add right succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Add right failed' })
          }
          this.$router.go()
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
