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
          <v-select
            class="select-sm"
            :reduce="(text) => text.value"
            label="text"
            :options="requests"
            v-model="request"
            @input="chooseRequest"
            size="sm"
          ></v-select>
          <p class="msg-error" v-if="msg.request">{{ msg.request }}</p>
        </b-form-group>
        <b-form-group
          label="Executed By"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <v-select
            class="select-sm"
            :reduce="(text) => text.value"
            label="text"
            v-model="executedBy"
            :options="executedBys"
            size="sm"
            @input="chooseExecutor"
            placeholder="Please select executor"
          ></v-select>
          <p class="msg-error" v-if="msg.executedBy">{{ msg.executedBy }}</p>
        </b-form-group>
        <b-form-group
          label="Job Schedule"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input
            size="sm"
            v-model="jobSchedule"
            :disabled="isSync"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Max Retry"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input size="sm" v-model="maxRetry"></b-form-input>
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
import { getAccounts } from '@/service/account'
import { getAllRequestApproved } from '@/service/request'
import { createJob } from '@/service/job'
import Vue from 'vue'
import vSelect from 'vue-select'
import { checkPermission } from '~/service/right'

Vue.component('v-select', vSelect)
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
      requests: [],
      executedBys: []
    }
  },
  watch: {
    maxRetry (value) {
      this.maxRetry = value
      this.validateMaxRetry(value)
    }
  },
  methods: {
    async show () {
      const dataAcc = {
        method: 'GET',
        path: 'list_account'
      }
      const dataRes = {
        method: 'GET',
        path: 'request'
      }
      const dataJob = {
        method: 'POST',
        path: 'job'
      }
      const resAccount = checkPermission(dataAcc)
      const resRes = checkPermission(dataRes)
      const resJob = checkPermission(dataJob)
      if (
        !resAccount.data.success ||
        !resRes.data.success ||
        !resJob.data.success
      ) {
        this.$notify({
          type: 'error',
          text: 'Error occurred! - Access Denied'
        })
      } else {
        const resAcc = await getAccounts()
        if (resAcc.code === '200') {
          this.executedBys = resAcc.data.map((e) => ({
            value: e.id,
            text: e.username
          }))
          const resReq = await getAllRequestApproved()
          if (resReq.code === '200') {
            resReq.data.forEach((item) => {
              this.requests.push({
                value: item.id,
                text: item.requestType + ' - ' + item.id
              })
            })
            this.isVisible = true
            this.maxRetry = 10
            this.jobSchedule = '0 0 0 ? * * *'
            this.isActive = false
            this.request = null
            this.executedBy = null
            this.msg.request = null
            this.msg.executedBy = null
          }
        }
      }
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
        const result = this.requests.find((request) => request.value === index)
        if (result.text.includes('SyncTable')) {
          this.jobSchedule = null
          this.isSync = true
        } else {
          this.jobSchedule = null
          this.isSync = false
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
      if (
        this.msg.request === '' &&
        this.msg.executedBy === '' &&
        this.msg.maxRetry === ''
      ) {
        try {
          this.isLoadingCreate = true
          const data = {
            requestId: this.request,
            executedById: this.executedBy,
            active: this.isActive,
            maxRetries: this.maxRetry
          }
          const res = await createJob(data)
          this.$emit('onAdded', res)
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Create job succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Create job failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Create job failed' })
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
</style>
