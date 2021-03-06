<template>
  <div v-if="!isDeny">
    <div v-if="detail">
      <b-col class="text-center">
        <h1>Database Detail</h1>
      </b-col>
      <b-table small :fields="dbFields" :items="[detail]"></b-table>

      <b-row>
        <b-col cols="10">
          <h4>Tables</h4>
        </b-col>
        <b-col class="text-right">
          <b-button @click="addTb(detail.id)" size="sm" variant="primary"
            ><i class="fa fa-plus pr-1"></i>Create Table</b-button
          >
        </b-col>
      </b-row>

      <section name="view" class="pt-3">
        <b-table
          small
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
            @click="detailTb(item.item.id)"
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
        <table-component-addTable ref="add" @onAdded="onReload" />
      </section>
      <section name="popup">
        <table-component-detailTable ref="detail" />
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
  </div>
  <div v-else>
    <common-deny />
  </div>
</template>

<script>
import { getDatabaseDetail } from '@/service/db'
import { getAllTableByDb } from '@/service/table.service'
import moment from 'moment'
import { checkPermission } from '~/service/right'

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
    key: 'alias'
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
    key: 'action',
    tdClass: 'text-center',
    thClass: 'text-center'
  }
]

export default {
  props: {
    id: {}
  },

  async created () {
    await this.checkPermission()
    if (!this.isDeny) {
      await this.getDetail()
    }
  },

  data () {
    return {
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      },
      dbFields: dbFields,
      tbFields: tbFields,
      detail: null,
      listTableDetail: null,
      loading: false,
      isDeny: false
    }
  },
  methods: {
    async checkPermission () {
      const dataDb = {
        method: 'GET',
        path: 'database_infor'
      }
      const dataTb = {
        method: 'GET',
        path: 'table'
      }
      const resDb = await checkPermission(dataDb)
      const resTb = await checkPermission(dataTb)
      if (!resDb.data.success || !resTb.data.success) {
        this.isDeny = true
      }
    },
    async getDetail () {
      try {
        this.loading = true
        const res = await getDatabaseDetail(this.id)
        const resList = await getAllTableByDb(
          this.id,
          this.pagination.page,
          this.pagination.limit
        )
        this.listTableDetail = resList.data
        this.pagination.total = resList.metaData.totalItem
        this.detail = res.data
        this.detail.host =
          this.detail.serverInfor.serverDomain +
          ' - ' +
          this.detail.serverInfor.serverHost
        if (res.data.databaseType === 'mysql') {
          this.detail.databaseType = 'MySql'
        }
        if (res.data.databaseType === 'postgresql') {
          this.detail.databaseType = 'PostgreSQL'
        }
        if (res.data.databaseType === 'oracle') {
          this.detail.databaseType = 'Oracle'
        }
        if (this.detail.createdDate === null) {
          this.detail.createdDate = 'YYYY-MM-DD'
        } else {
          this.detail.createdDate = moment(this.detail.createdDate).format(
            'YYYY-MM-DD'
          )
        }
        if (this.detail.modifiedDate === null) {
          this.detail.modifiedDate = 'YYYY-MM-DD'
        } else {
          this.detail.modifiedDate = moment(this.detail.modifiedDate).format(
            'YYYY-MM-DD'
          )
        }
        if (this.listTableDetail) {
          this.listTableDetail.forEach((e) => {
            if (e.createdDate === null) {
              e.createdDate = 'YYYY-MM-DD'
            } else {
              e.createdDate = moment(e.createdDate).format('YYYY-MM-DD')
            }
          })
          this.listTableDetail.forEach((e) => {
            if (e.modifiedDate === null) {
              e.modifiedDate = 'YYYY-MM-DD'
            } else {
              e.modifiedDate = moment(e.modifiedDate).format('YYYY-MM-DD')
            }
          })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Error occurred!' })
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
    detailTb (id) {
      this.$refs.detail.show(id)
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    }
  }
}
</script>

<style></style>
