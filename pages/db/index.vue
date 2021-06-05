<template>
  <div>
    <section name="action">
      <b-row>
        <b-col>
          <b-btn v-b-modal.new-db size="sm" variant="primary">
            <i class="fa fa-database pr-1" />
            Create Database Connection
          </b-btn>
        </b-col>
      </b-row>
    </section>
    <section name="view" class="pt-3">
      <b-table
        responsive
        hover
        striped
        :items="dbs"
        :fields="fields"
        :per-page="pagination.limit"
        :current-page="pagination.page"
      >
        <template #cell(no)="item">
          {{ item.index + 1 }}
        </template>

        <template #cell(action)>
          <b-btn v-b-tooltip="`Detail database config`" :to="{ path: 'db/view'}" size="sm" variant="success">
            <i class="fa fa-eye" />
          </b-btn>
          <b-btn v-b-tooltip="`Edit database config`" size="sm" variant="info">
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn
            v-b-tooltip="`Delete database config`"
            size="sm"
            variant="danger"
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
      />
    </section>
    <section name="popup">
      <b-modal id="new-db" title="Create Database Connection">
        <Config />
      </b-modal>
    </section>
    <section name="detailDb">
      <b-modal id="detailDb">
        <DatabaseDetail />
      </b-modal>
    </section>
  </div>
</template>

<script>
import Config from '@/components/db/config.vue'
import DatabaseDetail from '@/components/db/dbDetail.vue'

import {} from '@/service/db'

const TableFields = [
  {
    key: 'no'
  },
  {
    key: 'host',
    label: 'Databse url'
  },
  {
    key: 'port'
  },
  {
    key: 'db',
    sortable: true
  },
  {
    key: 'user'
  },
  {
    key: 'password'
  },
  {
    key: 'dataType'
  },
  {
    key: 'action'
  }
]

export default {
  components: { Config, DatabaseDetail },

  data: () => ({
    fields: TableFields,
    pagination: {
      page: 1,
      limit: 3,
      total: 4
    },

    //   methods: {
    //   async getListDBInfor () {
    //     try {
    //       const res = await this.getListDBInfor()

    //       this.list = res.data.map(e => ({ host: e.code, port: e.port }))
    //     } catch (e) {
    //       console.error(e)
    //     }
    //   }
    // }

    dbs: [
      {
        host: 'localhost',
        port: 3306,
        db: 'db1',
        user: 'root',
        password: '123',
        dataType: 'MySQL'
      },
      {
        host: 'localhost',
        port: 1663,
        db: 'db2',
        user: 'root',
        password: '123',
        dataType: 'MongoDB'
      },
      {
        host: 'localhost',
        port: 3306,
        db: 'db3',
        user: 'root',
        password: '123',
        dataType: 'MySQL'
      },
      {
        host: 'localhost',
        port: 1663,
        db: 'db4',
        user: 'root',
        password: '123',
        dataType: 'MongoDB'
      }
    ]
  })
}
</script>

<style></style>
