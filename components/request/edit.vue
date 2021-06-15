<template>
  <b-modal title="Edit Request" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
          <b-col>
          <label class="form-label">Request Type</label>
          <b-input size="sm" v-model="config.id" />
        </b-col>
        <b-col>
          <label class="form-label">Request Type</label>
          <b-input size="sm" v-model="config.requestType" />
        </b-col>
        </b-row>
      <b-row>
        <b-col>
          <label class="form-label">Approved By</label>
          <b-input size="sm" v-model="config.approvedBy" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label class="form-label">Table Name</label>
          <b-input size="sm" v-model="config.tableName" />
        </b-col>
        </b-row>
      <b-row>
        <b-col>
          <label class="form-label">Status</label>
          <b-input size="sm" v-model="config.status" />
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
export default {
  data: () => ({
    config: {
      id: 1,
      requestType: 'huonglinh',
      timeCreated: 1623558048000,
      creatorId: '1',
      approvedBy: 1623558048000,
      tableName: 'sadsdassd',
      status: 'pending'
    },
    isLoading: false
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = {
        data: [
          {
            id: 1,
            requestType: 'huonglinh',
            timeCreated: 1623558048000,
            creatorId: '1',
            approvedBy: 1623558048000,
            tableName: 'sadsdassd',
            status: 'pending'
          },
          {
            id: 2,
            requestType: 'huong',
            timeCreated: 1623558048000,
            creatorId: '1',
            approvedBy: 1623558048000,
            tableName: 'sadsdassd',
            status: 'approve'
          }
        ]
      }
      this.config.id = res.data.id
      this.config.requestType = res.data.requestType
      this.config.tableName = res.data.tableName
      this.config.status = res.data.status
      this.isLoading = false
    }
  }
}
</script>

<style></style>
