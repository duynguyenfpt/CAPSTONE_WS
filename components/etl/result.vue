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
import { getResultDetail } from '@/service/etl'
export default {
  data: () => ({
    isVisibleResult: false,
    idItem: 0,
    isLoading: false,
    resultFields: [],
    data: [],
    rows: []
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisibleResult = true
      this.isLoading = true
      const res = await getResultDetail(16)
      const totalArray = res.data.split('\n')
      this.resultFields = totalArray[0].split(',').map(item => {
        return {
          key: item
        }
      })
      const tempArray = totalArray.splice(1, totalArray.length - 1)
      tempArray.forEach(element => {
        const objData = {}
        const tempRow = element.split(',')
        this.resultFields.forEach((item, index) => {
          objData[`${item}`] = tempRow[index]
        })
        console.log('LCC: ', objData)
        this.data.push(objData)
      })
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
