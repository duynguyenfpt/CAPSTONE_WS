<template>
  <div>
    <b-modal v-model="isVisible" title="Edit Request" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row>
          <b-col>
            <label class="form-label">Request Type</label>
            <b-input size="sm" v-model="request.requestType" disabled />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <label class="form-label">Approved By</label>
            <v-select
              placeholder="Please select an approver"
              class="select-sm"
              :reduce="(text) => text.value"
              label="text"
              v-model="request.account"
              :options="opsAccount"
              size="sm"
              @input="chooseAccount"
            />
            <p class="msg-error" v-if="msg.account">{{ msg.account }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <label class="form-label">Status</label>
            <b-form-select
              v-model="request.status"
              :options="opsStatus"
              size="sm"
              @change="chooseStatus"
            ></b-form-select>
            <p class="msg-error" v-if="msg.status">{{ msg.status }}</p>
          </b-col>
        </b-row>
        <b-row class="pt-3">
          <b-col class="text-right">
            <b-button size="sm" variant="primary" @click="updateRequest">
              <b-spinner
                v-if="isLoadingUpdate"
                variant="primary"
                small
              ></b-spinner
              >Update</b-button
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
import { getDetailRequest, updateRequest } from '@/service/request'
import { getListAccount } from '@/service/account'
import Vue from 'vue'
import vSelect from 'vue-select'
import { checkPermission } from '~/service/right'

Vue.component('v-select', vSelect)
export default {
  data: () => ({
    request: {
      requestType: null,
      status: null,
      account: null
    },
    opsStatus: [],
    opsAccount: [],
    isLoading: false,
    isVisible: false,
    isLoadingUpdate: false,
    idItem: 0,
    msg: {
      account: null,
      status: null
    },
    isDeny: false
  }),
  methods: {
    async show (id) {
      const dataReq = {
        method: 'GET',
        path: 'request'
      }
      const resReq = await checkPermission(dataReq)
      const dataReqPut = {
        method: 'PUT',
        path: 'request'
      }
      const resReqPut = await checkPermission(dataReqPut)
      if (!resReq.data.success || !resReqPut.data.success) {
        this.$notify({
          type: 'error',
          text: 'Error occurred! - Access Denied'
        })
      } else {
        const accounts = await getListAccount(1, 100)
        if (accounts.code === '200') {
          this.opsAccount = accounts.data.map((acc) => {
            return { value: acc.username, text: acc.username }
          })
          this.idItem = id
          this.isVisible = true
          this.isLoading = true
          this.msg.account = ''
          this.msg.status = ''
          try {
            const res = await getDetailRequest(id)
            if (res.code === '200') {
              this.request.requestType = res.data.requestType
              this.request.status = res.data.status
              this.request.account = res.data.approvedBy
              if (this.request.status === '0') {
                this.opsStatus = [
                  { value: '0', text: 'Pending' },
                  { value: '2', text: 'Rejected' },
                  { value: '1', text: 'Approved' }
                ]
              }
              if (this.request.status === '1') {
                this.opsStatus = [{ value: '1', text: 'Approved' }]
              }
              if (this.request.status === '2') {
                this.opsStatus = [
                  { value: '2', text: 'Rejected' },
                  { value: '1', text: 'Approved' }
                ]
              }
            }
          } catch (e) {
            this.$notify({ type: 'error', text: 'Error occurred!' })
          } finally {
            this.isLoading = false
          }
        }
      }
    },
    chooseAccount () {
      if (this.request.account === null) {
        this.msg.account = 'Please select an approver'
      } else {
        this.msg.account = ''
      }
    },
    chooseStatus () {
      if (this.request.status === null) {
        this.msg.status = 'Please select a status'
      } else {
        this.msg.status = ''
      }
    },
    onClose () {
      this.isVisible = false
    },
    async updateRequest () {
      if (this.request.account === null) {
        this.msg.account = 'Please select an approver'
      }
      if (this.request.status === null) {
        this.msg.status = 'Please select a status'
      }
      if (this.msg.account === '' && this.msg.status === '') {
        try {
          this.isLoadingUpdate = true
          const body = {
            status: this.request.status,
            approvedBy: this.request.account
          }
          const data = await updateRequest(this.idItem, body)
          this.$emit('onUpdated', data)
          if (data.code === '200') {
            this.$notify({
              type: 'success',
              text: 'Update request succeeded'
            })
          } else {
            this.$notify({ type: 'error', text: 'Update request failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Update request failed' })
        } finally {
          this.isLoadingUpdate = false
          this.isVisible = false
        }
      }
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
