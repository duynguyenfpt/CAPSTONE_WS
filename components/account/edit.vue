<template>
  <b-modal v-model="isVisible" title="Edit Account" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <label class="form-label">Username</label>
          <b-input size="sm" v-model="username" />
          <p class="msg-error" v-if="msg.username">{{ msg.username }}</p>
          <label class="form-label">Email</label>
          <b-input size="sm" v-model="email" />
          <p class="msg-error" v-if="msg.email">{{ msg.email }}</p>
          <label class="form-label">Role</label>
          <b-form-select v-model="role" :options="roles" size="sm" @change="chooseRole"></b-form-select>
          <p class="msg-error" v-if="msg.role">{{ msg.role }}</p>
          <label class="form-label">Phone</label>
          <b-input size="sm" v-model="phone" />
          <p class="msg-error" v-if="msg.phone">{{ msg.phone }}</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="primary" @click="onUpdateAcc">
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
import { getAccountDetail, updateAccount } from '@/service/account'

export default {
  data: () => ({
    username: null,
    email: null,
    phone: null,
    role: null,
    isVisible: false,
    idItem: 0,
    isLoading: false,
    isLoadingUpdate: false,
    roles: [
      { value: null, text: 'Please select a role' },
      { value: 'viewer', text: 'Viewer' },
      { value: 'engineer', text: 'Engineer' },
      { value: 'admin', text: 'Admin' }
    ],
    msg: {
      username: null,
      email: null,
      phone: null,
      role: null
    }
  }),
  watch: {
    username (value) {
      this.username = value
      this.validateUsername(value)
    },
    email (value) {
      this.email = value
      this.validateEmail(value)
    },
    phone (value) {
      this.phone = value
      this.validatePhone(value)
    }
  },
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = await getAccountDetail(this.idItem)
      this.username = res.data.username
      this.email = res.data.email
      this.phone = res.data.phone
      this.role = res.data.role
      this.isLoading = false
      this.msg.role = null
      this.msg.username = null
      this.msg.phone = null
      this.msg.email = null
    },
    chooseRole () {
      if (this.role === null) {
        this.msg.role = 'Please select role'
      } else {
        this.msg.role = ''
      }
    },
    validateUsername (value) {
      if (/^[a-zA-Z-]+$/.test(value)) {
        this.msg.username = ''
      } else {
        this.msg.username = 'Invalid username'
      }
    },
    validateEmail (value) {
      if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
        this.msg.email = ''
      } else {
        this.msg.email = 'Invalid email address'
      }
    },
    validatePhone (value) {
      if (/((09|03|07|08|05)+([0-9]{8})\b)/g.test(value)) {
        this.msg.phone = ''
      } else {
        this.msg.phone = 'Invalid phone number'
      }
    },
    onClose () {
      this.isVisible = false
    },
    async onUpdateAcc () {
      this.validateUsername(this.username)
      this.validateEmail(this.email)
      this.validatePhone(this.phone)
      if (this.username === null) {
        this.msg.username = 'Invalid username'
      }
      if (this.role === null) {
        this.msg.role = 'Please select role'
      }
      if (this.msg.username === '' && this.msg.email === '' && this.msg.phone === '' && this.msg.role === '') {
        try {
          this.isLoadingUpdate = true
          const data = {
            username: this.username,
            email: this.email,
            role: this.role,
            phone: this.phone
          }
          const res = await updateAccount(this.idItem, data)
          this.$emit('onUpdated', data)
          if (res.code) {
            this.$notify({ type: 'success', text: 'Update account succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Update account failed' })
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
