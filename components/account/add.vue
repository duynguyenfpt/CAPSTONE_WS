<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-modal
        no-close-on-backdrop
        v-model="isVisible"
        title="Create Account"
        hide-footer
        size="lg"
      >
        <b-row class="pt-2">
          <b-col cols="3">
            <label class="form-lab"
              >Username <span class="msg-error">*</span></label
            >
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="username"></b-form-input>
            <p class="msg-error" v-if="msg.username">{{ msg.username }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="3">
            <label class="form-lab"
              >Email <span class="msg-error">*</span></label
            >
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="email"></b-form-input>
            <p class="msg-error" v-if="msg.email">{{ msg.email }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="3">
            <label class="form-lab"
              >Phone <span class="msg-error">*</span></label
            >
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="phone"></b-form-input>
            <p class="msg-error" v-if="msg.phone">{{ msg.phone }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="3">
            <label class="form-lab"
              >Role <span class="msg-error">*</span></label
            >
          </b-col>
          <b-col>
            <b-form-select
              v-model="role"
              :options="roles"
              size="sm"
              @change="chooseRole"
            ></b-form-select>
            <p class="msg-error" v-if="msg.role">{{ msg.role }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="3">
            <label class="form-lab"
              >Right <span class="msg-error">*</span></label
            >
          </b-col>
          <b-col>
            <b-form-radio-group
              class="pt-2"
              v-model="right"
              :options="rights"
              :aria-describedby="ariaDescribedby"
              @change="showRight"
              size="sm"
            ></b-form-radio-group>
          </b-col>
        </b-row>
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
            :data="dataArr"
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
          <v-select
            class="select-sm"
            :reduce="(text) => text.value"
            label="text"
            :options="opsAccount"
            v-model="account"
            size="sm"
            placeholder="Please select an account"
          ></v-select>
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
import { getAccounts, createAccount } from '@/service/account'
import { getAll, checkPermission } from '@/service/right'
import Vue from 'vue'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)

export default {
  data () {
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
        { text: 'Default right', value: 0 },
        { text: 'Select right', value: 1 },
        { text: 'Copy right', value: 2 }
      ],
      roles: [
        { value: null, text: 'Please select a role' },
        { value: 'viewer', text: 'Viewer' },
        { value: 'engineer', text: 'Engineer' },
        { value: 'admin', text: 'Admin' }
      ],
      opsAccount: [],
      isCopied: false,
      isSelected: false,
      dataArr: [],
      titles: [],
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
      const data = {
        method: 'POST',
        path: 'account'
      }
      const res = await checkPermission(data)
      if (!res.data.success) {
        this.$notify({
          type: 'error',
          text: 'Error occurred! - Access Denied'
        })
      } else {
        this.isVisible = true
        this.email = null
        this.username = null
        this.phone = null
        this.role = null
        this.account = null
        this.value = []
        this.right = 0
        this.isCopied = false
        this.isSelected = false
        this.msg.username = null
        this.msg.email = null
        this.msg.phone = null
        this.msg.role = null
      }
    },
    chooseRole () {
      if (this.role === null) {
        this.msg.role = 'Please select role'
      } else {
        this.msg.role = ''
      }
    },
    validateUsername (value) {
      if (/^[a-zA-Z_][\w]{0,127}$/.test(value)) {
        this.msg.username = ''
      } else {
        this.msg.username = 'Invalid username'
      }
    },
    validateEmail (value) {
      if (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
      ) {
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
      if (this.right === 0) {
        this.isSelected = false
        this.isCopied = false
      }
      if (this.right === 1) {
        this.isSelected = true
        this.isCopied = false
        const data = {
          method: 'GET',
          path: 'right'
        }
        const resPermission = await checkPermission(data)
        if (!resPermission.data.success) {
          this.$notify({
            type: 'error',
            text: 'Error occurred! - Access Denied'
          })
          this.isVisible = false
        } else {
          try {
            const res = await getAll()
            if (res.code === '200') {
              const states = res.data.map((item) => {
                return { id: item.id, name: item.path + ' - ' + item.method }
              })
              const initials = res.data.map((item) => {
                return item.path + ' - ' + item.method
              })
              this.dataArr = states.map((right, index) => {
                return {
                  label: right.name,
                  key: right.id,
                  initial: initials[index]
                }
              })
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
      } else if (this.right === 2) {
        this.isSelected = false
        this.isCopied = true
        const data = {
          method: 'GET',
          path: 'account'
        }
        const resPermission = await checkPermission(data)
        if (!resPermission.data.success) {
          this.$notify({
            type: 'error',
            text: 'Error occurred! - Access Denied'
          })
          this.isVisible = false
        } else {
          try {
            const res = await getAccounts()
            if (res.code === '200') {
              this.opsAccount = res.data.map((item) => {
                return { value: item.id, text: item.username }
              })
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
      if (
        this.msg.username === '' &&
        this.msg.email === '' &&
        this.msg.phone === '' &&
        this.msg.role === ''
      ) {
        try {
          this.isLoadingCreate = true
          const acc = {
            username: this.username,
            email: this.email,
            role: this.role,
            phone: this.phone
          }
          let data
          if (this.isCopied) {
            data = {
              account: acc,
              rightOption: 'copy',
              accountId: this.account
            }
          } else if (this.isSelected) {
            data = {
              account: acc,
              rightOption: 'select',
              rightIds: this.value
            }
          } else {
            data = {
              account: acc,
              rightOption: 'default'
            }
          }
          const res = await createAccount(data)
          this.$emit('onAdded')
          if (res.code === '201') {
            this.$notify({
              type: 'success',
              text: 'Create account succeeded'
            })
          } else {
            this.$notify({ type: 'error', text: 'Create account failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Create account failed' })
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

<style>
@import "vue-select/dist/vue-select.css";

.vs--searchable .vs__dropdown-toggle {
  width: 100%;
  min-width: 245.54px;
  white-space: nowrap;
  max-height: 31px;
  height: calc(1.5em + 0.5rem + 2px);
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  font-size: 0.875rem;
}

.vs__selected {
  margin: 0;
  padding-bottom: 3px;
  padding-left: 0;
}

.vs__actions {
  padding: 0;
  margin-right: 5px;
}

.vs__clear {
  margin-bottom: 2px;
}

.el-transfer-panel {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  display: inline-block;
  width: 245px;
  max-height: 100%;
  box-sizing: border-box;
  position: relative;
}

.el-transfer__buttons {
  display: inline-block;
  vertical-align: middle;
  padding: 0 15px;
}
</style>
