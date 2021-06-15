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
            v-b-tooltip="`Edit request config`"
            size="sm"
            variant="info"
          >
            <i class="fa fa-pen" />
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
      <section name="popup">
      <request-edit ref="edit"/>
      </section>
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
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    },
    edit (id) {
      this.$refs.edit.show(id)
    }
  }
}
</script>

<style></style>
