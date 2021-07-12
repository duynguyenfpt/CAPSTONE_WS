<template>
  <b-modal v-model="isVisible" title="Log Note" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <div class="info">
        <p><strong>Info!</strong> Some text...</p>
      </div>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="primary" @click="createLog" class="btn-add-request">
            <b-spinner
              v-if="isLoadingCreate"
              variant="primary"
              small
            ></b-spinner
            >Log</b-button
          >
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import { getDetailRequest, updateRequest } from '@/service/request'
import { getListAccount } from '@/service/account'
export default {
  data: () => ({
    request: {
      requestType: null,
      status: null,
      creatorId: null,
      approvedById: null
    },
    opsStatus: [
      { value: 'pending', text: 'Pending' },
      { value: 'rejected', text: 'Rejected' },
      { value: 'approved', text: 'Approved' }
    ],
    opsAccount: [
      { value: '1', text: 'Huong' },
      { value: '2', text: 'Linh' }
    ],
    isLoading: false,
    isVisible: false,
    isLoadingUpdate: false,
    idItem: 0,
    account: {
      id: null
    }
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      try {
        const res = await getDetailRequest(id)
        this.request.requestType = res.data.requestType
        this.request.status = res.data.status
        // get username
        const accounts = await getListAccount(1, 100)
        this.opsAccount = accounts.data.map((acc) => ({
          value: acc.id,
          text: acc.username
        }))
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoading = false
      }
    },
    onClose () {
      this.isVisible = false
    },
    async updateRequest () {
      try {
        this.isLoadingUpdate = true
        const body = {
          status: this.request.status,
          requestType: this.request.requestType,
          approvedById: this.account.id
        }
        const data = await updateRequest(this.idItem, body)
        if (data.id) throw new Error('Update failed')
        this.$notify({ type: 'success', text: 'Update successful' })
        this.$emit('onUpdated', data)
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoadingUpdate = false
        this.isVisible = false
      }
    }
  }
}
</script>

<style></style>
