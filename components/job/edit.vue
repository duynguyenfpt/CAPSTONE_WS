<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-modal v-model="isVisible" title="Edit Job" hide-footer>
        <b-form-group
          label="Request"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input
            v-model="request"
            size="sm"
            disabled
          ></b-form-input>
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
import { getAllAccount } from '@/service/account'
import { getDetailJob, updateJob } from '@/service/job'
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
      executedBys: [
        { value: null, text: 'Please select executor' }
      ],
      idItem: 0
    }
  },
  async mounted () {
    const resAcc = await getAllAccount()
    // eslint-disable-next-line array-callback-return
    resAcc.data.map(item => {
      this.executedBys.push({ value: item.id, text: item.username })
    })
  },
  watch: {
    maxRetry (value) {
      this.maxRetry = value
      this.validateMaxRetry(value)
    }
  },
  methods: {
    async show (id) {
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
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoading = false
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
      }
      if (this.maxRetry === null) {
        this.msg.maxRetry = 'Invalid max retry'
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
