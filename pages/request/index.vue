<template>
  <div v-if="request">
      <b-row class="pt-2">
          <b-col class="text-center">
                <h2>Request Management</h2>
          </b-col>
      </b-row>
    <br/>
    <b-table :fields="tableFields" :items="request">
      <template #cell(action)="item">
          <b-btn
            @click="edit(item.item.id)"
            size="sm"
            variant="info"
          >
            <i class="fa fa-pen" />
          </b-btn>
        <b-btn
          size="sm"
          variant="danger"
          @click="deleteRequest(item.item.id)"
        >
          <i class="fa fa-trash" />
        </b-btn>
      </template>
       <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>
    </b-table>
     <b-pagination
        size="sm"
        v-model="pagination.page"
        :per-page="pagination.limit"
        :total-rows="pagination.total"
        align="right"
        @input="getList"
      />
      <section name="popup">
      <request-edit ref="edit" @onUpdated="refreshData" />
      </section>
  </div>
</template>

<script>
import { getRequest } from '@/service/request'
import moment from 'moment'
const tableFields = [
  {
    key: 'no'
  },
  {
    key: 'requestType'
  },
  {
    key: 'creator.userName',
    label: 'Creator'
  },
  {
    key: 'approvedBy.userName',
    label: 'Approver'
  },
  {
    key: 'status',
    variant: 'denger'
  },
  {
    key: 'createdDate'
  },
  {
    key: 'modifiedDate'
  },
  {
    key: 'action'
  }
]

export default {
  data () {
    return {
      pagination: {
        page: 1,
        limit: 4,
        total: 0
      },
      tableFields: tableFields,
      request: null
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      try {
        const res = await getRequest(this.pagination.page, this.pagination.limit)
        this.request = res.data
        this.pagination.total = res.metaData.totalItem
        this.request.forEach((e) => {
          e.createdDate = moment(this.request.createdDate).format(
            'YYYY-MM-DD'
          )
          e.modifiedDate = moment(this.request.modifiedDate).format(
            'YYYY-MM-DD'
          )
        })
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    },
    edit (id) {
      console.log(id)
      this.$refs.edit.show(id)
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    refreshData (data) {
      if (data) {
        this.getList()
      }
    }
  }
}
</script>

<style></style>
