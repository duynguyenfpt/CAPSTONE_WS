<template>
  <div v-if="detail">
    <h4>Database detail</h4>
    <b-table :fields="dbFields" :items="[detail]"></b-table>

    <b-row>
      <b-col cols="10">
        <h4>Tables</h4>
      </b-col>
      <b-col class="pb-2">
        <b-button v-b-modal.add-table size="sm" variant="primary"
          >Add Table</b-button
        >
      </b-col>
    </b-row>

    <b-table class="pt-2" :fields="dbTable" :items="detail.tables">
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
      :per-page="pagination.limit"
      v-model="pagination.page"
      :total-rows="pagination.total"
      align="right"
      pills
      size="sm"
    />

    <section name="popup">
      <b-modal id="add-table" title="Add Table" hide-footer>
        <AddTable v-if="detail" :database="detail" />
      </b-modal>
    </section>
  </div>
</template>

<script>
import { getDatabaseDetail } from '@/service/db'
import { deleteTableDetail } from '@/service/table.service'
import AddTable from '@/components/table-component/addTable.vue'
import moment from 'moment'

const dbFields = [
  {
    key: 'database_name'
  },
  {
    key: 'port'
  },
  {
    key: 'username'
  },
  {
    key: 'database_type'
  },
  {
    key: 'created_by'
  },
  {
    key: 'created_date'
  },
  {
    key: 'modified_by'
  },
  {
    key: 'modified_date'
  },
  {
    key: 'action'
  }
]

const dbTable = [
  {
    key: 'tableName'
  },
  {
    key: 'created_by'
  },
  {
    key: 'created_date'
  },
  {
    key: 'modified_by'
  },
  {
    key: 'modified_date'
  },
  {
    key: 'action'
  }
]

const fields = [
  {
    key: 'databaseName',
    label: 'Database Name'
  },
  {
    key: 'table',
    label: 'Table'
  }
]
export default {
  components: {
    AddTable
  },
  props: {
    id: {}
  },

  created () {
    this.getDetail()
  },

  data () {
    return {
      pagination: {
        page: 1,
        limit: 10,
        total: 10
      },
      fields: fields,
      dbFields: dbFields,
      dbTable: dbTable,
      detail: null
    }
  },
  // code mẫu ở màn DB info
  // Thay sang api table
  methods: {
    async getDetail () {
      try {
        const res = await getDatabaseDetail(this.id)
        this.detail = res
        this.detail.created_date = moment(this.detail.created_date).format(
          'YYYY-MM-DD'
        )
        this.detail.modified_date = moment(this.detail.modified_date).format(
          'YYYY-MM-DD'
        )
        this.detail.tables.forEach((e) => {
          e.created_date = moment(e.created_date).format('YYYY-MM-DD')
        })
        this.detail.tables.forEach((e) => {
          e.modified_date = moment(e.modified_date).format('YYYY-MM-DD')
        })
      } catch (e) {}
    },
    async deleteTableDetail (id) {
      const result = await deleteTableDetail(id)
      if (result) {
        this.$message.error('Delete unsuccessfully!')
      } else {
        this.$message.success('Delete Success!')
        this.$router.go()
      }
    }
  }
}
</script>

<style></style>
