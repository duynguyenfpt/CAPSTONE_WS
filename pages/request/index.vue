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
            v-b-tooltip="`Detail database config`"
            :to="{ name: 'db-id', params: { id: item.item.id } }"
            size="sm"
            variant="success"
          >
            <i class="fa fa-eye" />
          </b-btn>
        <b-btn
          v-b-tooltip="`Delete`"
          size="sm"
          variant="danger"
          @click="deleteRequest(item.item.id)"
        >
          <i class="fa fa-trash" />
        </b-btn>
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
  </div>
</template>

<script>
import moment from 'moment'
const tableFields = [
  {
    key: 'id'
  },
  {
    key: 'requestType'
  },
  {
    key: 'creatorId'
  },
  {
    key: 'timeCreated'
  },
  {
    key: 'approvedBy'
  },
  {
    key: 'status'
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
      console.log('ngpao function')
      try {
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
        this.request = res.data
        this.request.forEach((e) => {
          e.createdDate = moment(this.request.createdDate).format(
            'YYYY-MM-DD'
          )
          e.modifiedDate = moment(this.request.modifiedDate).format(
            'YYYY-MM-DD'
          )
        })
      } catch (error) {
        this.$message.error(error.message)
      }
    }
  }
}
</script>

<style></style>
