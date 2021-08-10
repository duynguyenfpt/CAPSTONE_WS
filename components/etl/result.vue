<template>
  <b-modal v-model="isVisibleResult" title="Result" hide-footer size="lg">
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col v-if="isExecuted">
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
        <b-col v-else>
          <div class="text-center">
            <b-spinner variant="primary" label="Text Centered"></b-spinner>
            <h5>{{ msg }}</h5>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col cols="6">
          <b-button size="sm" variant="success" @click="onDownload" v-if="isExecuted">
            Download
          </b-button>
        </b-col>
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
import { getResultDetail } from '@/service/etl'
export default {
  data: () => ({
    isVisibleResult: false,
    idItem: 0,
    isLoading: false,
    resultFields: [],
    rows: [],
    isExecuted: false,
    msg: null
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisibleResult = true
      this.isLoading = true
      this.rows = []
      const res = await getResultDetail(this.idItem)
      const totalArray = res.data.split('\n')
      const header = []
      if (res.data !== '') {
        header.push({
          key: 'no'
        })
        this.isExecuted = true
      } else {
        this.isExecuted = false
        this.msg = res.message
      }
      totalArray.forEach((element, index) => {
        if (index === 0) {
          // eslint-disable-next-line array-callback-return
          element.split(',').map(item => {
            header.push({
              key: item
            })
          })
        } else {
          const tempRow = element.split(',')
          const objData = {}
          header.forEach((item, i) => {
            if (item.key === 'no') {
              objData[`${item.key}`] = index
            } else {
              objData[`${item.key}`] = tempRow[i - 1]
            }
          })
          this.rows.push(objData)
        }
      })
      this.resultFields = header
      this.isLoading = false
    },
    onClose () {
      this.isVisibleResult = false
    }
  }
}
</script>

<style></style>
