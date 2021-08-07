<template>
  <b-modal v-model="isVisible" title="Edit Right" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <label class="form-label">Right Code</label>
          <b-input size="sm" v-model="code" />
          <p class="msg-error" v-if="msg.code">{{ msg.code }}</p>
          <label class="form-label">Right Name</label>
          <b-input size="sm" v-model="name" />
          <p class="msg-error" v-if="msg.name">{{ msg.name }}</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="primary" @click="onUpdateRight">
            <b-spinner v-if="isLoadingUpdate" variant="primary" small></b-spinner>Update</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>

export default {
  data: () => ({
    code: null,
    name: null,
    isVisible: false,
    idItem: 0,
    isLoading: false,
    isLoadingUpdate: false,
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
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      this.isLoading = false
      this.msg.code = null
      this.msg.name = null
      this.isLoadingUpdate = false
    },
    onClose () {
      this.isVisible = false
    },
    async onUpdateRight () {
      this.validateName(this.name)
      this.validateCode(this.code)
      this.validatePhone(this.phone)
      if (this.code === null) {
        this.msg.code = 'Invalid right code'
      }
      if (this.name === null) {
        this.msg.name = 'Invalid right name'
      }
      if (this.msg.name === '' && this.msg.code === '') {
        try {
          this.isLoadingUpdate = true
          const data = {
            code: this.code,
            name: this.name
          }
          const res = data
          this.$emit('onUpdated', data)
          if (res.code === '200') {
            this.$notify({ type: 'success', text: 'Update right succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Update right failed' })
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
