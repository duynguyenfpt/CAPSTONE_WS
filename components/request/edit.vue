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
          <b-input size="sm" v-model="request.approver" />
        </b-col>
        <b-col>
          <label class="form-label">Creator</label>
          <b-input size="sm" v-model="request.creator" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label class="form-label">status</label>
          <b-input size="sm" v-model="request.status" />
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
export default {
  data: () => ({
    request: {
      requestType: null,
      status: null,
      creator: null,
      approver: null
    },
    isLoading: false,
    isVisible: false
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = {
        code: '200',
        data: [
          {
            id: 1,
            createdBy: null,
            createdDate: null,
            modifiedBy: null,
            modifiedDate: null,
            status: 'pending',
            creator: {
              id: 1,
              createdBy: null,
              createdDate: null,
              modifiedBy: null,
              modifiedDate: null,
              userName: 'vulong',
              email: 'vulong22121999@gmail.com',
              role: 'viewer',
              phone: '0898266025'
            },
            approvedBy: {
              id: 1,
              createdBy: null,
              createdDate: null,
              modifiedBy: null,
              modifiedDate: null,
              userName: 'vulong',
              email: 'vulong22121999@gmail.com',
              role: 'viewer',
              phone: '0898266025'
            },
            requestType: 'DONG_BO'
          }
        ],
        metaData: {
          totalPage: 1,
          totalItem: 1
        }
      }
      // this.request.id = res.data.id
      this.request.requestType = res.data.requestType
      // this.request.creator = res.data.creator.userName
      // this.request.approver = res.data.approvedBy.userName
      this.request.status = res.data.status
      this.isLoading = false
    }
  }
}
</script>

<style></style>
