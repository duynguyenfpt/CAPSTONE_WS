<template>
  <b-modal v-model="isVisible" title="Edit Request" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <label class="form-label">Request Type</label>
          <b-input size="sm" v-model="request.requestType" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label class="form-label">Approver</label>
          <b-input size="sm" v-model="request.approvedById" />
        </b-col>
        <b-col>
          <label class="form-label">Creator</label>
          <b-input size="sm" v-model="request.creatorId" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label class="form-label">status</label>
          <b-input size="sm" v-model="request.status" />
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="primary" @click="onUpdateDB">
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
import { getDetailRequest, updateRequest } from '@/service/request'
export default {
  data: () => ({
    request: {
      requestType: null,
      status: null,
      creatorId: null,
      approvedById: null
    },
    isLoading: false,
    isVisible: false,
    isLoadingUpdate: false,
    idItem: 0
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = await getDetailRequest(id)
      this.request.requestType = res.data.requestType
      this.request.creator = res.data.creator.userName
      this.request.approver = res.data.approvedBy.userName
      this.request.status = res.data.status
      this.isLoading = false
    },
    onClose () {
      this.isVisible = false
    },
    async onUpdateDB () {
      try {
        this.isLoadingUpdate = true
        const data = await updateRequest(this.idItem, this.config)
        this.isLoadingUpdate = false
        this.isVisible = false
        this.$emit('onUpdated', data)
        if (data.id) {
          this.$notify({ type: 'error', text: 'Update failed' })
        } else {
          this.$notify({ type: 'success', text: 'Update successful' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    }
  }
}
</script>

<style></style>
