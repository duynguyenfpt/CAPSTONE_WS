<template>
<div v-if="!isDeny">
 <div v-if="table">
     <h1 class="text-center">Table Detail</h1>
     <b-table :fields="fields" :items="[table]"></b-table>
     <h4 class="text-center">Table Schema</h4>
     <b-table :fields="schemaFields" :items="litSchema" :busy="loading">
       <template #table-busy>
          <content-placeholders class="article-card-block">
            <content-placeholders-text :lines="2" />
            <content-placeholders-text :lines="6" />
          </content-placeholders>
        </template>
     </b-table>
     <b-pagination
        size="sm"
        v-model="pagination.page"
        :per-page="pagination.limit"
        :total-rows="pagination.total"
        align="right"
        @input="getDetail"
      />
 </div>
 <div v-else>
   <content-placeholders class="article-card-block">
      <content-placeholders-text :lines="3" />
      <content-placeholders-text :lines="18" />
    </content-placeholders>
 </div>
 </div>
 <div v-else>
   <common-deny/>
 </div>
</template>

<script>
import { getTableDetail, getSchemaByTableId } from '@/service/table.service'

import moment from 'moment'

const fields = [
  {
    key: 'tableName'
  },
  {
    key: 'databaseInfo.databaseName',
    label: 'Database Name'
  },
  {
    key: 'databaseInfo.databaseType',
    label: 'Database Type'
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
  }
]
const schemaFields = [
  {
    key: 'rowName'
  },
  {
    key: 'rowType'
  },
  {
    key: 'typeSize'
  },
  {
    key: 'defaultValue'
  },
  {
    key: 'possibleValue'
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
  }
]

export default {
  props: {
    id: {}
  },
  data: () => ({
    table: null,
    fields: fields,
    litSchema: null,
    schemaFields: schemaFields,
    pagination: {
      page: 1,
      limit: 5,
      total: 5
    },
    loading: false,
    isDeny: false
  }),
  created () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      try {
        this.loading = true
        const res = await getTableDetail(this.id)
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.tableList = res.data
          if (this.tableList.databaseInfo.databaseType === 'mysql') {
            this.tableList.databaseInfo.databaseType = 'My Sql'
          }
          if (this.tableList.databaseInfo.databaseType === 'postgresql') {
            this.tableList.databaseInfo.databaseType = 'PostgreSQL'
          }
          if (this.tableList.databaseInfo.databaseType === 'oracle') {
            this.tableList.databaseInfo.databaseType = 'Oracle'
          }
          const resSchema = await getSchemaByTableId(this.id, this.pagination.page, this.pagination.limit)
          if (resSchema.statusCode === '403') {
            this.isDeny = true
          } else {
            this.litSchema = resSchema.data
            this.pagination.total = resSchema.metaData.totalItem
            this.table = res.data
            this.table.currentTableSchemas = res.data.currentTableSchemas
            this.table.createdDate = this.table.createdDate ? moment(this.table.createdDate).format('YYYY-MM-DD') : 'YYYY-MM-DD'
            this.table.modifiedDate = this.table.modifiedDate ? moment(this.table.modifiedDate).format('YYYY-MM-DD') : 'YYYY-MM-DD'
            if (this.table.currentTableSchemas) {
              this.table.currentTableSchemas.forEach((e) => {
                e.createdDate = e.createdDate ? moment(e.createdDate).format('YYYY-MM-DD') : 'YYYY-MM-DD'
              })
              this.table.currentTableSchemas.forEach((e) => {
                e.modifiedDate = e.modifiedDate ? moment(e.modifiedDate).format('YYYY-MM-DD') : 'YYYY-MM-DD'
              })
            }
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
