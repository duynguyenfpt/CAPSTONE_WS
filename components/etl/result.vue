<template>
<div>
  <b-modal v-model="isVisibleResult" title="Sample Data" hide-footer size="lg">
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
          :fields="resultFields">
          <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
          </template>
          </b-table>
        </b-col>
        <b-col v-else>
          <div class="text-center" v-if="isFailed">
            <h5 class="msg-fail">{{ msgErr }}</h5>
          </div>
          <div class="text-center" v-else>
            <b-spinner variant="primary" label="Text Centered"></b-spinner>
            <h5>{{ msg }}</h5>
          </div>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col cols="6">
          <b-button size="sm" variant="warning" @click="onDownload" v-if="isExecuted">
            <i v-if="isDownload" class="fa fa-spin fa-spinner" />
            <i v-else class="fa fa-download" />
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
  </div>
</template>

<script>
import { getResultDetail, downloadData } from '@/service/etl'
import { saveAs } from 'file-saver'
import { checkPermission } from '~/service/right'
export default {
  data: () => ({
    isVisibleResult: false,
    idItem: 0,
    isLoading: false,
    resultFields: [],
    rows: [],
    isExecuted: false,
    msg: '',
    isDownload: false,
    isFailed: false,
    msgErr: ''
  }),
  methods: {
    async show (id) {
      const data = {
        method: 'GET',
        path: 'etl_request'
      }
      const res = await checkPermission(data)
      if (!res.data.success) {
        this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
      } else {
        this.idItem = id
        this.isVisibleResult = true
        this.isLoading = true
        this.msg = ''
        this.rows = []
        try {
          const res = await getResultDetail(this.idItem)
          if (res.code === '200') {
            if (res.data.status === 'successed') {
              const totalArray = res.data.content.split('\n')
              const header = []
              header.push({
                key: 'no'
              })
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
              this.isExecuted = true
            } else {
              if (res.data.status === 'failed') {
                this.isExecuted = false
                this.isFailed = true
                this.msgErr = 'Query is failed'
              } else {
                this.isExecuted = false
                this.msg = 'Query is executing'
              }
            }
            this.isLoading = false
          } else {
            this.isExecuted = true
            this.msg = 'Query is failed'
          }
        } catch (e) {
          this.isExecuted = true
          this.msg = e.message
        }
      }
    },
    onClose () {
      this.isVisibleResult = false
    },
    async onDownload () {
      const data = {
        method: 'GET',
        path: 'dowload_csv'
      }
      const resPermission = await checkPermission(data)
      if (!resPermission.data.success) {
        this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
      } else {
        try {
          this.isDownload = true
          const res = await downloadData(this.idItem)
          const blob = new Blob([res], { type: 'text/plain;charset=utf-8' })
          const name = `${new Date().getTime()}.csv`
          saveAs(blob, name)
          this.$notify({
            type: 'success',
            text: 'Download result succeeded'
          })
          console.log('notify')
        } catch (e) {
          this.$notify({ type: 'error', text: 'Error occurred!' })
        } finally {
          this.isDownload = false
        }
      }
    }
  }
}
</script>

<style>
.msg-fail {
  color: red;
}
</style>
