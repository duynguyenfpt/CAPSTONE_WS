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
       @input="detail.tables"
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
    key: 'databaseName'
  },
  {
    key: 'port'
  },
  {
    key: 'username'
  },
  {
    key: 'databaseType'
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

const dbTable = [
  {
    key: 'tableName'
  },
  {
    key: 'createdBy'
  },
  {
    key: 'createDate'
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
        limit: 4,
        total: 0
      },
      fields: fields,
      dbFields: dbFields,
      dbTable: dbTable,
      detail: null
    }
  },
  methods: {
    async getDetail () {
      try {
        const res = await getDatabaseDetail(this.id)
        this.detail = res.data
        this.detail.createdDate = moment(this.detail.createdDate).format(
          'YYYY-MM-DD'
        )
        this.detail.modifiedDate = moment(this.detail.modifiedDate).format(
          'YYYY-MM-DD'
        )
        if (this.detail.tables) {
          this.detail.tables.forEach((e) => {
            e.createdDate = moment(e.createdDate).format('YYYY-MM-DD')
          })
          this.detail.tables.forEach((e) => {
            e.modifiedDate = moment(e.modifiedDate).format('YYYY-MM-DD')
          })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    },
    async deleteTableDetail (id) {
      const result = await deleteTableDetail(id)
      if (result) {
        this.$notify({ type: 'success', text: 'Delete Success!' })
        this.$router.go()
      } else {
        this.$notify({ type: 'error', text: 'Delete unsuccessfully!' })
        this.$router.go()
      }
    }
  }
}
</script>

<style></style>
