<template>
  <div v-if="tableList">
    <b-table :fields="tableFields" :items="tableList">
      <template #cell(action)="item">
        <b-btn
          v-b-tooltip="`Detail table config`"
          :to="{ name: 'table-id', params: { id: item.item.id } }"
          size="sm"
          variant="success"
        >
          <i class="fa fa-eye" />
        </b-btn>
        <b-btn
          v-b-tooltip="`Delete table config`"
          size="sm"
          variant="danger"
          @click="deleteTableDetail(item.item.id)"
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
        @input="getListTable"
      />
  </div>
</template>

<script>
import moment from 'moment'
const tableFields = [
  {
    key: 'tableName'
  },
  {
    key: 'createdBy'
  },
  {
    key: 'createdDate'
  },
  {
    key: 'modifiedBy'
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
      tableList: null
    }
  },
  created () {
    this.getListTable()
  },
  methods: {
    async getListTable () {
      console.log('ngpao function')
      try {
        const res = {
          data: [
            {
              id: 1,
              createdBy: 'huong',
              createdDate: 1623558048000,
              modifiedBy: 'linh',
              modifiedDate: 1623558048000,
              tableName: 'sadsdassd',
              databaseInforId: 1,
              currentTableSchemas: [
                {
                  tableRowId: 1,
                  rowName: 'rowName',
                  rowType: 'rowType',
                  typeSize: 'typeSize',
                  defaultValue: 'defaultValue',
                  possibleValue: 'possibleVale',
                  table_id: '1'
                }
              ]
            },
            {
              id: 2,
              createdBy: 'duy',
              createdDate: 1623558048000,
              modifiedBy: 'long',
              modifiedDate: 1623558048000,
              tableName: 'tablename',
              databaseInforId: 1,
              currentTableSchemas: [
                {
                  tableRowId: 2,
                  rowName: 'rowName',
                  rowType: 'rowType',
                  typeSize: 'typeSize',
                  defaultValue: 'defaultValue',
                  possibleValue: 'possibleVale',
                  table_id: '1'
                }
              ]
            }
          ]
        }
        this.tableList = res.data
        this.tableList.forEach((e) => {
          e.createdDate = moment(this.tableList.createdDate).format(
            'YYYY-MM-DD'
          )
          e.modifiedDate = moment(this.tableList.modifiedDate).format(
            'YYYY-MM-DD'
          )
        })
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.$notify({ text: 'Heyy !!!' })
      }
    }
  }
}
</script>

<style></style>
