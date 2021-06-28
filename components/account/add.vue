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
          <b-form-input size="sm" v-model="config.username"></b-form-input>
        </b-form-group>
        <b-form-group
          label="Email:"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input size="sm" v-model="config.email"></b-form-input>
        </b-form-group>
        <b-form-group
          label="Role:"
          label-cols-sm="3"
          class="mb-0"
          v-slot="{ ariaDescribedby }"
          label-size="sm"
        >
          <b-form-radio-group
            class="pt-2"
            v-model="config.role"
            :options="roles"
            :aria-describedby="ariaDescribedby"
            @change="showRole"
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
          filter-placeholder="Search role"
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
            v-model="config.account"
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
import { getAllAccount } from '@/service/account'

export default {
  data () {
    const generateData = (_) => {
      const data = []
      const states = [
        'California',
        'Illinois',
        'Maryland',
        'Texas',
        'Florida',
        'Colorado',
        'Connecticut '
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
      config: {
        username: null,
        email: null,
        account: null,
        role: null,
        tick: null
      },
      isLoading: false,
      isLoadingCreate: false,
      isVisible: false,
      roles: [
        { text: 'Select role', value: 1 },
        { text: 'Copy role', value: 2 }
      ],
      opsAccount: [{ value: null, text: 'Please select an account' }],
      isCopied: false,
      isSelected: false,
      data: generateData(),
      titles: ['LinhCancer', 'Linh Ham'],
      value: [],
      filterMethod (query, item) {
        return item.initial.toLowerCase().indexOf(query.toLowerCase()) > -1
      }
    }
  },
  async mounted () {
    this.isLoading = true
    // const hosts = await getAllServers()
    // // eslint-disable-next-line array-callback-return
    // hosts.data.map(item => {
    //   this.dbHosts.push({ value: item.id, text: item.serverHost })
    // })
    this.isLoading = false
  },

  methods: {
    async show () {
      this.isVisible = true
    },
    async getAllAccount () {
      const res = await getAllAccount()
      // eslint-disable-next-line array-callback-return
      res.data.map((item) => {
        this.opsAccount.push({ value: item.id, text: item.username })
      })
    },
    showRole () {
      if (this.config.role === 1) {
        this.isSelected = true
        this.isCopied = false
      } else if (this.config.role === 2) {
        this.isSelected = false
        this.isCopied = true
        getAllAccount()
      } else {
        this.isSelected = false
        this.isCopied = false
      }
    },
    async createAccount () {
      try {
        this.isLoadingCreate = true
        const res = true
        this.isLoadingCreate = false
        this.isVisible = false
        this.$emit('onAdded')
        if (res.code) {
          this.$notify({ type: 'success', text: 'Create account succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Create account failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    }
  }
}
</script>
