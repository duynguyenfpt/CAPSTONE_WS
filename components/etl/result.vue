<template>
  <b-modal v-model="isVisibleResult" title="Result" hide-footer size="lg">
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <b-table
          responsive
          hover
          striped
          :items="rows"
          :fields="resultFields"
          :busy="loading">
          <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
          </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="light" @click="onClose">
            Close
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
const resultFields = [
  {
    key: 'id'
  },
  {
    key: 'name'
  },
  {
    key: 'content'
  },
  {
    key: 'createdBy'
  },
  {
    key: 'createdDate'
  }
]
export default {
  data: () => ({
    isVisibleResult: false,
    idItem: 0,
    isLoading: false,
    resultFields: resultFields,
    data: [
      { id: 1, name: 'Select All', content: 'Select * from database', createdBy: 'longvt', createdDate: '2021-08-03' },
      { id: 2, name: 'Select All', content: 'Select * from database', createdBy: 'lcc', createdDate: '2021-08-04' },
      { id: 3, name: 'Select All', content: 'Select * from database', createdBy: 'linhcancer', createdDate: '2021-08-02' },
      { id: 4, name: 'Select All', content: 'Select * from database', createdBy: 'longvt', createdDate: '2021-08-04' }
    ],
    rows: []
  }),

  methods: {
    async show (id) {
      this.idItem = id
      this.isVisibleResult = true
      this.isLoading = true
      this.rows = this.data
      this.isLoading = false
    },
    onClose () {
      this.isVisibleResult = false
    }
  }
}
</script>

<style></style>
