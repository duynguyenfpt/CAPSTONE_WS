<template>
  <div>
    <section name="action">
      <b-row>
        <b-col cols="4" class="text-left">
          <b-input-group>
            <b-input
              size="sm"
              placeholder="Search"
              v-model="textSearch"
              @keyup.enter="searchAccount(textSearch)"
            />
            <b-input-group-append>
              <b-btn
                size="sm"
                variant="primary"
                @click="searchAccount(textSearch)"
              >
                <i class="fas fa-search" />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col class="text-right">
          <b-btn @click="addAccount()" size="sm" variant="primary">
            <i class="fa fa-plus pr-1" />
            Create Account
          </b-btn>
        </b-col>
      </b-row>
    </section>
    <section name="view" class="pt-3">
      <b-table
        responsive
        hover
        striped
        :items="accounts"
        :fields="fields"
        :busy="loading"
      >
        <template #cell(no)="item">
          {{ countRecord(item.index) }}
        </template>

        <template #cell(action)="item">
          <b-btn
            @click="detailAccount(item.item.id)"
            size="sm"
            variant="success"
          >
            <i class="fa fa-eye" />
          </b-btn>
          <b-btn @click="editAccount(item.item.id)" size="sm" variant="info">
            <i class="fa fa-pen" />
          </b-btn>
          <b-btn
            size="sm"
            variant="warning"
            @click="resetPassword(item.item.id)"
          >
            <i class="fas fa-exchange-alt"></i>
          </b-btn>
          <b-btn
            size="sm"
            variant="danger"
            @click="activeAccount(item.item.id)"
          >
            <i class="fa fa-power-off" />
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
        @input="getList"
      />
    </section>
    <section name="popup">
      <account-add ref="add" @onAdded="onReload" />
    </section>
    <section name="popup">
      <account-detail ref="detail" @onDetailed="onReload" />
    </section>
    <section name="popup">
      <account-edit ref="edit" @onUpdated="refreshData" />
    </section>
    <section name="popup">
      <account-reset ref="reset" @onReseted="onReload" />
    </section>
    <section name="popup">
      <account-active ref="active" @onActived="onReload" />
    </section>
  </div>
</template>

<script>
import { getListAccount, searchAccount } from '@/service/account'

const accountFields = [
  {
    key: 'no'
  },
  {
    key: 'username'
  },
  {
    key: 'email'
  },
  {
    key: 'role'
  },
  {
    key: 'phone'
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
    fields: accountFields,
    textSearch: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    loading: false,
    accounts: []
  }),

  created () {
    this.getList()
  },

  methods: {
    async getList () {
      this.loading = true
      try {
        const res = await getListAccount(
          this.pagination.page,
          this.pagination.limit
        )
        this.accounts = res.data
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
    refreshData (data) {
      if (data) {
        this.getList()
      }
    },
    addAccount () {
      this.$refs.add.show()
    },
    detailAccount (id) {
      this.$refs.detail.show(id)
    },
    editAccount (id) {
      this.$refs.edit.show(id)
    },
    resetPassword (id) {
      this.$refs.reset.show(id)
    },
    activeAccount (id) {
      this.$refs.active.show(id)
    },
    async searchAccount (page, limit, textSearch) {
      this.loading = true
      try {
        const result = await searchAccount(
          this.pagination.page,
          this.pagination.limit,
          this.textSearch
        )
        this.accounts = result.data
        this.pagination.total = result.metaData.totalItem
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
