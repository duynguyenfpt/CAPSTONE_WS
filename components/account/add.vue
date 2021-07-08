<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-modal v-model="isVisible" title="Create Account" hide-footer size="lg">
        <b-form-group
          label="Username:"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input size="sm" v-model="username"></b-form-input>
          <p class="msg-error" v-if="msg.username">{{ msg.username }}</p>
        </b-form-group>
        <b-form-group
          label="Email:"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input size="sm" v-model="email"></b-form-input>
          <p class="msg-error" v-if="msg.email">{{ msg.email }}</p>
        </b-form-group>
        <b-form-group
          label="Phone:"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input size="sm" v-model="phone"></b-form-input>
          <p class="msg-error" v-if="msg.phone">{{ msg.phone }}</p>
        </b-form-group>
        <b-form-group
          label="Role:"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-select
          v-model="role"
          :options="roles"
          size="sm"
          @change="chooseRole"
        ></b-form-select>
          <p class="msg-error" v-if="msg.role">{{ msg.role }}</p>
        </b-form-group>
        <b-form-group
          label="Right:"
          label-cols-sm="3"
          class="mb-0"
          v-slot="{ ariaDescribedby }"
          label-size="sm"
        >
          <b-form-radio-group
            class="pt-2"
            v-model="right"
            :options="rights"
            :aria-describedby="ariaDescribedby"
            @change="showRight"
            size="sm"
          ></b-form-radio-group>
        </b-form-group>
        <br />
        <b-form-group
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
          v-if="isSelected"
        >
          <el-transfer
          style="text-align: left; display: inline-block"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="Search right"
          v-model="value"
          :data="data"
          :titles="['Select', 'Selected']"
          >
          </el-transfer>
        </b-form-group>
        <b-form-group
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
          v-if="isCopied"
        >
          <b-form-select
            size="sm"
            v-model="account"
            :options="opsAccount"
          ></b-form-select>
        </b-form-group>
        <b-row class="pt-3">
          <b-col class="text-right">
            <b-button size="sm" variant="primary" @click="createAccount">
              <b-spinner
                v-if="isLoadingCreate"
                variant="primary"
                small
              ></b-spinner>
              Create
            </b-button>
            <b-button size="sm" variant="light" @click="onClose">
              Cancel
            </b-button>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { getAllAccount, createAccount } from '@/service/account'

export default {
  data () {
    const generateData = (_) => {
      const data = []
      const states = [
        'Create Account',
        'Create Database',
        'Create Table',
        'Creat Job',
        'Creat Request',
        'Create Server',
        'Edit Database '
      ]
      const initials = ['CA', 'IL', 'MD', 'TX', 'FL', 'CO', 'CT']
      states.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          initial: initials[index]
        })
      })
      return data
    }
    return {
      username: null,
      email: null,
      phone: null,
      account: null,
      role: null,
      right: null,
      isLoading: false,
      isLoadingCreate: false,
      isVisible: false,
      rights: [
        { text: 'Select right', value: 1 },
        { text: 'Copy right', value: 2 }
      ],
      roles: [
        { value: null, text: 'Please select a role' },
        { value: 'viewer', text: 'Viewer' },
        { value: 'engineer', text: 'Engineer' },
        { value: 'admin', text: 'Admin' }
      ],
      opsAccount: [{ value: null, text: 'Please select an account' }],
      isCopied: false,
      isSelected: false,
      data: generateData(),
      titles: ['LinhCancer', 'Linh Ham'],
      value: [],
      msg: {
        username: null,
        email: null,
        phone: null,
        role: null
      },
      filterMethod (query, item) {
        return item.initial.toLowerCase().indexOf(query.toLowerCase()) > -1
      }
    }
  },
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
    async show () {
      this.isVisible = true
      this.email = null
      this.username = null
      this.phone = null
      this.role = null
      this.isCopied = null
      this.isSelected = null
      this.msg.username = null
      this.msg.email = null
      this.msg.phone = null
      this.msg.role = null
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
    async showRight () {
      if (this.right === 1) {
        this.isSelected = true
        this.isCopied = false
      } else if (this.right === 2) {
        this.isSelected = false
        this.isCopied = true
        const res = await getAllAccount()
        // eslint-disable-next-line array-callback-return
        res.data.map((item) => {
          this.opsAccount.push({ value: item.id, text: item.userName })
        })
      } else {
        this.isSelected = false
        this.isCopied = false
      }
    },
    async createAccount () {
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
          this.isLoadingCreate = true
          const data = {
            username: this.username,
            email: this.email,
            role: this.role,
            phone: this.phone
          }
          const res = await createAccount(data)
          this.$emit('onAdded')
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Create account succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Create account failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        } finally {
          this.isLoadingCreate = false
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
