<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-modal no-close-on-backdrop v-model="isVisible" title="Edit Job" hide-footer>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab"
              >Request</label
            >
          </b-col>
          <b-col>
            <b-form-input disabled v-model="request" size="sm"></b-form-input>
          <p class="msg-error" v-if="msg.request">{{ msg.request }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab"
              >Executed By <span class="msg-error">*</span></label
            >
          </b-col>
          <b-col>
            <v-select
              class="select-sm"
              :reduce="(text) => text.value"
              label="text"
              v-model="executedBy"
              :options="executedBys"
              size="sm"
              @input="chooseExecutor"
              placeholder="Please select an executor"
            ></v-select>
            <p class="msg-error" v-if="msg.executedBy">{{ msg.executedBy }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab"
              >Job Schedule</label
            >
          </b-col>
          <b-col>
            <b-form-input
            size="sm"
            v-model="jobSchedule"
            :disabled="isSync"
          ></b-form-input>
          <p class="msg-error" v-if="msg.request">{{ msg.request }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab"
              >Max Retry <span class="msg-error">*</span></label
            >
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="maxRetry"></b-form-input>
          <p class="msg-error" v-if="msg.maxRetry">{{ msg.maxRetry }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-2">
          <b-col cols="4">
            <label class="form-lab"
              >Is Active</label
            >
          </b-col>
          <b-col>
            <b-form-checkbox
            v-model="isActive"
            name="checkbox-1"
            value="true"
            unchecked-value="false"
          ></b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="pt-3">
          <b-col class="text-right">
            <b-button size="sm" variant="primary" @click="updateJob">
              <b-spinner
                v-if="isLoadingUpdate"
                variant="primary"
                small
              ></b-spinner>
              Update
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
import { getDetailJob, updateJob } from '@/service/job'
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
      isLoadingUpdate: false,
      isVisible: false,
      isSync: false,
      requestId: null,
      msg: {
        executedBy: null,
        maxRetry: null
      },
      executedBys: [],
      idItem: 0
    }
  },
  watch: {
    maxRetry (value) {
      this.maxRetry = value
      this.validateMaxRetry(value)
    }
  },
  methods: {
    async show (id) {
      const dataRes = {
        method: 'GET',
        path: 'request'
      }
      const dataJob = {
        method: 'PUT',
        path: 'job'
      }
      const resRes = await checkPermission(dataRes)
      const resJob = await checkPermission(dataJob)
      if (!resRes.data.success || !resJob.data.success) {
        this.$notify({
          type: 'error',
          text: 'Error occurred! - Access Denied'
        })
      } else {
        const resAcc = await getAccounts()
        if (resAcc.code === '200') {
          this.executedBys = resAcc.data.map((item) => {
            return { value: item.id, text: item.username }
          })
          this.isVisible = true
          this.idItem = id
          this.maxRetry = 10
          this.jobSchedule = '0 0 0 ? * * *'
          this.isActive = false
          this.requestId = null
          this.request = null
          this.executedBy = null
          this.msg.executedBy = null
          try {
            const res = await getDetailJob(id)
            if (res.code === '200') {
              this.request = res.data.request.requestType + ' - All'
              this.requestId = res.data.request.id
              this.executedBy = res.data.excutedBy.id
              this.jobSchedule = res.data.jobSchedule
              this.maxRetry = res.data.maxRetries
              this.isActive = res.data.active
              if (res.data.request.requestType === 'SyncTable') {
                this.isSync = true
              } else {
                this.isSync = false
              }
            }
          } catch (e) {
            this.$notify({
              type: 'error',
              text: 'Error occurred!'
            })
            this.isVisible = false
          } finally {
            this.isLoading = false
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
    chooseExecutor () {
      if (this.executedBy === null) {
        this.msg.executedBy = 'Please select executor'
      } else {
        this.msg.executedBy = ''
      }
    },
    async updateJob () {
      if (this.executedBy === null) {
        this.msg.executedBy = 'Please select executor'
      } else {
        this.msg.executedBy = ''
      }
      if (this.maxRetry === null) {
        this.msg.maxRetry = 'Invalid max retry'
      } else {
        this.msg.maxRetry = ''
      }
      if (this.msg.executedBy === '' && this.msg.maxRetry === '') {
        try {
          this.isLoadingUpdate = true
          const body = {
            requestId: this.requestId,
            executedById: this.executedBy,
            jobSchedule: this.jobSchedule,
            active: this.isActive,
            maxRetries: this.maxRetry
          }
          const data = await updateJob(this.idItem, body)
          this.$emit('onUpdated', data)
          if (data.code === '200') {
            this.$notify({ type: 'success', text: 'Update job succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Update job failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Update job failed' })
        } finally {
          this.isLoadingUpdate = false
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
