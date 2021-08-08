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
        <b-col cols="6">
          <b-button size="sm" variant="success" @click="onDownload">
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
    rows: []
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisibleResult = true
      this.isLoading = true
      const res = await getResultDetail(this.idItem)
      const totalArray = res.data.split('\n')
      let header = []
      totalArray.forEach((element, index) => {
        if (index === 0) {
          header = element.split(',').map(item => {
            return {
              key: item
            }
          })
        } else {
          const tempRow = element.split(',')
          const objData = {}
          header.forEach((item, index) => {
            objData[`${item.key}`] = tempRow[index]
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
