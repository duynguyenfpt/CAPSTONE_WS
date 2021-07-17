<template>
  <div v-if="detail">
    <h4>Database detail</h4>
    <b-table :fields="dbFields" :items="[detail]"></b-table>

    <b-row>
      <b-col cols="10">
        <h4>Tables</h4>
      </b-col>
      <b-col class="text-right">
        <b-button @click="addTb(detail.id)" size="sm" variant="primary"
          >Add Table</b-button
        >
      </b-col>
    </b-row>

    <section namen="view" class="pt-3">
      <b-table
        responsive
        hover
        striped
        :items="listTableDetail"
        :fields="tbFields"
        :busy="loading"
      >
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>

        <template #cell(action)="item">
          <b-btn
            :to="{ name: 'table-id', params: { id: item.item.id } }"
            size="sm"
            variant="success"
          >
            <i class="fa fa-eye" />
          </b-btn>
          <b-btn
            size="sm"
            variant="danger"
            @click="deleteTableDetail(item.item.id)"
          >
            <i class="fa fa-trash" />
          </b-btn>
        </template>
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
      </b-table>
      <b-pagination
        :per-page="pagination.limit"
        v-model="pagination.page"
        :total-rows="pagination.total"
        align="right"
        size="sm"
        @input="getDetail"
      />
    </section>
    <section name="popup">
      <table-component-addTable ref="add" @onAdded="onReload"/>
    </section>
    <section name="popup">
      <table-component-deleteTable ref="delete" @onDeleted="onReload" />
    </section>
  </div>
   <div v-else>
   <content-placeholders class="article-card-block">
      <content-placeholders-text :lines="3" />
      <content-placeholders-text :lines="18" />
    </content-placeholders>
 </div>
</template>

<script>
import { getDatabaseDetail } from '@/service/db'
import { getAllTableByDb } from '@/service/table.service'
import moment from 'moment'

const dbFields = [
  {
    key: 'databaseName'
  },
  {
    key: 'host'
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
  }
]

const tbFields = [
  {
    key: 'no'
  },
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
        limit: 5,
        total: 0
      },
      dbFields: dbFields,
      tbFields: tbFields,
      detail: null,
      listTableDetail: null,
      loading: false
    }
  },
  methods: {
    async getDetail () {
      try {
        this.loading = true
        const res = await getDatabaseDetail(this.id)
        const resList = await getAllTableByDb(this.id, this.pagination.page, this.pagination.limit)
        this.listTableDetail = resList.data
        this.pagination.total = resList.metaData.totalItem
        this.detail = res.data
        this.detail.createdDate = moment(this.detail.createdDate).format(
          'YYYY-MM-DD'
        )
        this.detail.modifiedDate = moment(this.detail.modifiedDate).format(
          'YYYY-MM-DD'
        )
        if (this.listTableDetail) {
          this.listTableDetail.forEach((e) => {
            e.createdDate = moment(e.createdDate).format('YYYY-MM-DD')
          })
          this.listTableDetail.forEach((e) => {
            e.modifiedDate = moment(e.modifiedDate).format('YYYY-MM-DD')
          })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    async deleteTableDetail (id) {
      this.$refs.delete.show(id)
    },
    onReload () {
      this.getDetail()
    },
    addTb (id) {
      this.$refs.add.show(id)
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    }
  }
}
</script>

<style></style>
