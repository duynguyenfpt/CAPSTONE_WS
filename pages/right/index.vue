<template>
  <div v-if="!isDenyRight">
    <b-row>
      <b-col class="text-center">
        <h1>Right Management</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">
        <section name="action">
          <b-row>
            <b-col cols="8" class="text-left">
              <b-input-group>
                <b-input
                  size="sm"
                  placeholder="Search"
                  v-model="rightSearch"
                  @keyup.enter="onSearchRight(rightSearch)"
                />
                <b-input-group-append>
                  <b-btn
                    size="sm"
                    variant="primary"
                    @click="onSearchRight(rightSearch)"
                  >
                    <i class="fas fa-search" />
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col cols="4" class="text-right">
              <b-btn @click="addRight()" size="sm" variant="primary">
                <i class="fa fa-plus pr-1" />
                Create Right
              </b-btn>
            </b-col>
          </b-row>
        </section>
        <section name="view" class="pt-3">
          <b-table
            responsive
            hover
            striped
            :items="rights"
            :fields="rightFields"
            :busy="loadingRight"
          >
            <template #cell(no)="item">
              {{ countRecordRight(item.index) }}
            </template>

            <template #cell(action)="item">
              <b-btn
                @click="detailRight(item.item.id)"
                size="sm"
                variant="success"
              >
                <i class="fa fa-eye" />
              </b-btn>
              <b-btn @click="editRight(item.item.id)" size="sm" variant="info">
                <i class="fa fa-pen" />
              </b-btn>
              <b-btn
                size="sm"
                variant="danger"
                @click="deleteRight(item.item.id)"
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
            size="sm"
            v-model="paginationRight.page"
            :per-page="paginationRight.limit"
            :total-rows="paginationRight.total"
            align="right"
            @input="searchRight"
          />
        </section>
        <section name="popup">
          <right-add ref="add" @onAdded="onReload" />
        </section>
        <section name="popup">
          <right-detail ref="detail" @onDetailed="onReload" />
        </section>
      </b-col>
      <b-col cols="6" v-show="!isDenyAccount">
        <section name="action">
          <b-row>
            <b-col cols="4">
              <h4>Account</h4>
            </b-col>
            <b-col cols="8" class="text-right">
              <b-input-group>
                <b-input
                  size="sm"
                  placeholder="Search"
                  v-model="accountSearch"
                  @keyup.enter="onSearchAccount(accountSearch)"
                />
                <b-input-group-append>
                  <b-btn
                    size="sm"
                    variant="primary"
                    @click="onSearchAccount(accountSearch)"
                  >
                    <i class="fas fa-search" />
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </section>
        <section name="view" class="pt-3">
          <b-table
            responsive
            hover
            striped
            :items="accounts"
            :fields="accountFields"
            :busy="loadingAccount"
            @row-clicked="showRightByAccount"
          >
            <template #cell(no)="item">
              {{ countRecordAccount(item.index) }}
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
            v-model="paginationAccount.page"
            :per-page="paginationAccount.limit"
            :total-rows="paginationAccount.total"
            align="right"
            @input="searchAccount"
          />
        </section>
        <section name="action" v-show="!isDenyAccountRight">
          <b-row>
            <b-col cols="3">
              <h6>Account's Right</h6>
            </b-col>
            <b-col cols="7" class="text-right">
              <el-select
                class="w-100"
                v-model="rightUpdate"
                multiple
                filterable
                no-match-text="Data search not found"
                placeholder="Choose right"
              >
                <el-option
                  v-for="item in opsRight"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </b-col>
            <b-col cols="2">
              <b-btn
                size="sm"
                variant="success"
                :disabled="isChoseAcc"
                @click="addRightByAccount"
                >Update
              </b-btn>
            </b-col>
          </b-row>
        </section>
        <section name="view" class="pt-3" v-show="!isDenyAccountRight">
          <b-table
            responsive
            hover
            striped
            :items="accountRight"
            :fields="accountRightFields"
            :busy="loadingAccountRight"
          >
            <template #cell(no)="item">
              {{ countRecordAccountRight(item.index) }}
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
            v-model="paginationAccountRight.page"
            :per-page="paginationAccountRight.limit"
            :total-rows="paginationAccountRight.total"
            align="right"
            @input="showRightByAccount"
          />
        </section>
      </b-col>
    </b-row>
    <section name="popup">
      <right-delete ref="delete" @onDeleted="onReload" />
    </section>
    <section name="popup">
      <right-edit ref="edit" @onUpdated="onReload" />
    </section>
    <section name="popup">
      <right-detail ref="detail" />
    </section>
  </div>
  <div v-else>
    <common-deny/>
  </div>
</template>

<script>
import {
  getList,
  getRightByAcc,
  getAll,
  createRightForAcc,
  deleteRightForAcc,
  getAllRightByAcc,
  searchRight
} from '@/service/right'
import { getListAccount, searchAccount } from '@/service/account'

const rightFields = [
  {
    key: 'no'
  },
  {
    key: 'path'
  },
  {
    key: 'method'
  },
  {
    key: 'description'
  },
  {
    key: 'action'
  }
]

const accountRightFields = [
  {
    key: 'no'
  },
  {
    key: 'path'
  },
  {
    key: 'method'
  },
  {
    key: 'description'
  }
]

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
  }
]

export default {
  props: {
    id: {}
  },
  data: () => ({
    rightFields: rightFields,
    accountFields: accountFields,
    accountRightFields: accountRightFields,
    paginationRight: {
      page: 1,
      limit: 10,
      total: 0
    },
    paginationAccount: {
      page: 1,
      limit: 5,
      total: 0
    },
    paginationAccountRight: {
      page: 1,
      limit: 5,
      total: 0
    },
    loadingRight: false,
    loadingAccount: false,
    loadingAccountRight: false,
    rightSearch: null,
    accountSearch: null,
    rightUpdate: null,
    rights: null,
    accounts: null,
    accountRight: null,
    opsRight: [],
    account: null,
    oldRight: [],
    isChoseAcc: true,
    textRight: null,
    textAccount: null,
    isDenyRight: false,
    isDenyAccount: false,
    isDenyAccountRight: true
  }),

  created () {
    this.getRightList()
    this.getAccountList()
  },

  methods: {
    async getRightList () {
      this.loadingRight = true
      try {
        const resRight = await getList(
          this.paginationRight.page,
          this.paginationRight.limit
        )
        if (resRight.statusCode === '403') {
          this.isDenyRight = true
        } else {
          this.rights = resRight.data
          this.paginationRight.total = resRight.metaData.totalItem
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loadingRight = false
      }
    },
    async getAccountList () {
      this.loadingAccount = true
      try {
        const resAccount = await getListAccount(
          this.paginationAccount.page,
          this.paginationAccount.limit
        )
        if (resAccount.statusCode === '403') {
          this.isDenyAccount = true
        } else {
          this.accounts = resAccount.data
          this.accounts.forEach((e) => {
            if (e.role === 'admin') {
              e.role = 'Admin'
            }
            if (e.role === 'viewer') {
              e.role = 'Viewer'
            }
            if (e.role === 'engineer') {
              e.role = 'Engineer'
            }
          })
          this.paginationAccount.total = resAccount.metaData.totalItem
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loadingAccount = false
      }
    },
    countRecordRight (index) {
      return (
        (this.paginationRight.page - 1) * this.paginationRight.limit + index + 1
      )
    },
    countRecordAccount (index) {
      return (
        (this.paginationAccount.page - 1) * this.paginationAccount.limit +
        index +
        1
      )
    },
    countRecordAccountRight (index) {
      return (
        (this.paginationAccountRight.page - 1) *
          this.paginationAccountRight.limit +
        index +
        1
      )
    },
    onReload () {
      this.getRightList()
    },
    addRight () {
      this.$refs.add.show()
    },
    async showRightByAccount (record) {
      this.loadingAccountRight = true
      try {
        this.rightUpdate = []
        this.account = record.id
        const res = await getRightByAcc(
          this.account,
          this.paginationAccountRight.page,
          this.paginationAccountRight.limit
        )
        if (res.statusCode === '403') {
          this.isDenyAccountRight = true
        } else {
          this.isDenyAccountRight = false
          this.accountRight = res.data
          const resAll = await getAllRightByAcc(this.account)
          // eslint-disable-next-line array-callback-return
          resAll.data.map((item) => {
            this.rightUpdate.push(item.id)
          })
          this.oldRight = this.rightUpdate
          this.paginationAccountRight.total = res.metaData.totalItem
          const resRight = await getAll()
          this.opsRight = resRight.data.map((item) => {
            return { value: item.id, label: item.path + ' - ' + item.method }
          })
          this.isChoseAcc = false
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loadingAccountRight = false
      }
    },
    async addRightByAccount () {
      try {
        const data = {
          accountId: this.account,
          rightIds: this.rightUpdate
        }
        const dataDel = {
          rightIds: this.oldRight
        }
        const resDel = await deleteRightForAcc(this.account, dataDel)
        const res = await createRightForAcc(data)
        if (res.code === '201' && resDel.code === '200') {
          this.$notify({
            type: 'success',
            text: 'Update right succeeded'
          })
        } else {
          this.$notify({ type: 'error', text: 'Update right failed' })
        }
        this.loadingAccountRight = true
        try {
          const res = await searchRight(
            this.account,
            this.paginationAccountRight.page,
            this.paginationAccountRight.limit
          )
          this.accountRight = res.data
          this.paginationAccountRight.total = res.metaData.totalItem
          const resRight = await getAll()
          this.opsRight = resRight.data.map((item) => {
            return { value: item.id, label: item.path + ' - ' + item.method }
          })
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        } finally {
          this.loadingAccountRight = false
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.rightUpdate = null
        this.isChoseAcc = true
      }
    },
    async searchRight () {
      this.loadingRight = true
      try {
        const resRight = await searchRight(
          this.paginationRight.page,
          this.paginationRight.limit,
          this.textRight
        )
        this.rights = resRight.data
        this.paginationRight.total = resRight.metaData.totalItem
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loadingRight = false
      }
    },
    onSearchRight () {
      this.paginationRight.page = 1
      this.textRight = this.rightSearch
      this.searchRight()
    },
    async searchAccount () {
      this.loadingAccount = true
      try {
        const resAcc = await searchAccount(
          this.paginationAccount.page,
          this.paginationAccount.limit,
          this.textAccount
        )
        this.accounts = resAcc.data
        this.accounts.forEach((e) => {
          if (e.role === 'admin') {
            e.role = 'Admin'
          }
          if (e.role === 'viewer') {
            e.role = 'Viewer'
          }
          if (e.role === 'engineer') {
            e.role = 'Engineer'
          }
        })
        this.paginationAccount.total = resAcc.metaData.totalItem
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.loadingAccount = false
      }
    },
    onSearchAccount () {
      this.paginationAccount.page = 1
      this.textAccount = this.accountSearch
      this.searchAccount()
    },
    deleteRight (id) {
      this.$refs.delete.show(id)
    },
    editRight (id) {
      this.$refs.edit.show(id)
    },
    detailRight (id) {
      this.$refs.detail.show(id)
    }
  }
}
</script>

<style></style>
