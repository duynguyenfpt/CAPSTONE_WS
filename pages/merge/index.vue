<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h1>Merge Request Management</h1>
      </b-col>
    </b-row>
    <section name="action">
      <b-row>
        <b-col class="text-right">
          <b-btn size="sm" variant="primary" :to="{ name: 'merge-add' }">
            <i class="fa fa-plus pr-1" />
            Create Merge Request
          </b-btn>
        </b-col>
      </b-row>
    </section>
    <section name="view" class="pt-3">
      <b-table
        responsive
        hover
        striped
        :items="merges"
        :fields="fields"
        :busy="loading"
      >
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>

        <template #cell(action)="item">
          <b-btn @click="editMerge(item.item.id)" size="sm" variant="info">
            <i class="fa fa-pen" />
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
        size="sm"
        v-model="pagination.page"
        :per-page="pagination.limit"
        :total-rows="pagination.total"
        align="right"
        @input="getListMerge"
      />
    </section>
    <section name="popup">
      <account-edit ref="edit" @onUpdated="onReload" />
    </section>
  </div>
</template>

<script>

const mergeFields = [
  {
    key: 'no'
  },
  {
    key: 'tables'
  },
  {
    key: 'tableMerge'
  },
  {
    key: 'action'
  }
]

export default {
  props: {
    id: {}
  },
  data: () => ({
    fields: mergeFields,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    loading: false,
    merges: []
  }),

  created () {
    this.getListMerge()
  },

  methods: {
    async getListMerge () {
      this.loading = true
      try {
        const res = {
          code: '200',
          data: [
            { id: 1, tables: 'Sale1 - Sale2 - Sale3', tableMerge: 'tm1' },
            { id: 2, tables: 'Sale1 - Sale2 - Sale3', tableMerge: 'tm1' },
            { id: 3, tables: 'Sale1 - Sale2 - Sale3', tableMerge: 'tm1' },
            { id: 4, tables: 'Sale1 - Sale2 - Sale3', tableMerge: 'tm1' },
            { id: 5, tables: 'Sale1 - Sale2 - Sale3', tableMerge: 'tm1' }
          ],
          metaData: { totalPage: 1, totalItem: 5 }
        }
        this.merges = res.data
        this.pagination.total = res.metaData.totalItem
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    },
    countRecord (index) {
      return (this.pagination.page - 1) * this.pagination.limit + index + 1
    },
    onReload () {
      this.getList()
    },
    editMerge (id) {
      this.$refs.edit.show(id)
    }
  }
}
</script>

<style></style>
