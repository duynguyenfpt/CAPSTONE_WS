<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-modal v-model="isVisible" title="Create Job" hide-footer>
        <b-form-group
          label="Request"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-select
            v-model="request"
            :options="requests"
            size="sm"
            @change="chooseRequest"
          ></b-form-select>
          <p class="msg-error" v-if="msg.request">{{ msg.request }}</p>
        </b-form-group>
        <b-form-group
          label="Executed By"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-select
            v-model="executedBy"
            :options="executedBys"
            size="sm"
            @change="chooseExecutor"
          ></b-form-select>
          <p class="msg-error" v-if="msg.executedBy">{{ msg.executedBy }}</p>
        </b-form-group>
        <b-form-group
          label="Job Schedule"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input size="sm" v-model="jobSchedule" :disabled= "isSync"></b-form-input>
        </b-form-group>
        <b-form-group
          label="Max Retry"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input
            size="sm"
            v-model="maxRetry"
          ></b-form-input>
          <p class="msg-error" v-if="msg.maxRetry">{{ msg.maxRetry }}</p>
        </b-form-group>
        <b-form-group
          label="Is Active"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-checkbox
            v-model="isActive"
            name="checkbox-1"
            value="true"
            unchecked-value="false"
          >
          </b-form-checkbox>
        </b-form-group>
        <b-row class="pt-3">
          <b-col class="text-right">
            <b-button size="sm" variant="primary" @click="createJob">
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
import { getAllRequest } from '@/service/request'
import { createJob } from '@/service/job'
export default {
  data () {
    return {
      request: null,
      executedBy: null,
      jobSchedule: null,
      maxRetry: null,
      isActive: false,
      isLoading: false,
      isLoadingCreate: false,
      isVisible: false,
      isSync: false,
      msg: {
        request: null,
        executedBy: null,
        maxRetry: null
      },
      requests: [
        { value: null, text: 'Please select request' }
      ],
      executedBys: [
        { value: null, text: 'Please select executor' }
      ]
    }
  },
  async mounted () {
    const resAcc = await getAllAccount()
    // eslint-disable-next-line array-callback-return
    resAcc.data.map(item => {
      this.executedBys.push({ value: item.id, text: item.username })
    })
    const resReq = await getAllRequest()
    // eslint-disable-next-line array-callback-return
    resReq.data.map(item => {
      this.requests.push({ value: item.id, text: item.requestType + ' - ' + item.id })
    })
  },
  watch: {
    maxRetry (value) {
      this.maxRetry = value
      this.validateMaxRetry(value)
    }
  },
  methods: {
    async show () {
      this.isVisible = true
      this.maxRetry = 10
      this.jobSchedule = '0 0 0 ? * * *'
      this.isActive = false
      this.request = null
      this.executedBy = null
      this.msg.request = null
      this.msg.executedBy = null
    },
    validateMaxRetry (value) {
      if (/^[\d]/.test(value)) {
        this.msg.maxRetry = ''
      } else {
        this.msg.maxRetry = 'Invalid max retry'
      }
    },
    chooseRequest () {
      if (this.request === null) {
        this.msg.request = 'Please select request'
      } else {
        this.msg.request = ''
        const index = this.request
        if (this.requests[index].text.includes('SyncTable')) {
          this.jobSchedule = null
          this.isSync = true
        }
      }
    },
    chooseExecutor () {
      if (this.executedBy === null) {
        this.msg.executedBy = 'Please select executor'
      } else {
        this.msg.executedBy = ''
      }
    },
    async createJob () {
      this.validateMaxRetry(this.maxRetry)
      if (this.request == null) {
        this.msg.request = 'Please select request'
      }
      if (this.executedBy == null) {
        this.msg.executedBy = 'Please select executor'
      }
      if (this.maxRetry == null) {
        this.msg.executedBy = 'Invalid max retry'
      }
      if (this.msg.request === '' && this.msg.executedBy === '' && this.msg.maxRetry === '') {
        try {
          this.isLoadingCreate = true
          console.log('LCC: ', this.isActive)
          const data = {
            requestId: this.request,
            executedById: this.executedBy,
            active: this.isActive,
            maxRetry: this.maxRetry
          }
          const res = await createJob(data)
          this.$emit('onAdded', res)
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Create job succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Create job failed' })
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
