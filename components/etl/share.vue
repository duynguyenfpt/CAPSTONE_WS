<template>
  <div>
    <b-modal no-close-on-backdrop v-model="isVisibleShare" title="Share" hide-footer>
      <div v-if="isLoading" class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <div v-else>
        <b-row>
          <b-col>
            <label>Account</label>
            <div>
              <el-select
                class="w-100"
                v-model="accounts"
                multiple
                filterable
                no-match-text="Data search not found"
                no-data-text="No data"
                placeholder="Choose account you want to share"
              >
                <el-option
                  v-for="item in opsAccount"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </b-col>
        </b-row>
        <b-row class="pt-3">
          <b-col class="text-right">
            <b-button size="sm" variant="primary" @click="onShare">
              <b-spinner
                v-if="isLoadingShare"
                variant="primary"
                small
              ></b-spinner>
              <i class="fas fa-share"></i>
              Share
            </b-button>
            <b-button size="sm" variant="light" @click="onClose">
              Close
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getAccounts } from '@/service/account'
import { shareEtl } from '@/service/etl'
import Vue from 'vue'
import vSelect from 'vue-select'
import { checkPermission } from '~/service/right'
Vue.component('v-select', vSelect)

export default {
  data: () => ({
    isVisibleShare: false,
    idItem: 0,
    isLoading: false,
    opsAccount: [],
    accounts: [],
    isLoadingShare: false
  }),

  methods: {
    async show (id) {
      const dataEtl = {
        method: 'POST',
        path: 'share'
      }
      const resEtl = await checkPermission(dataEtl)
      if (!resEtl.data.success) {
        this.$notify({
          type: 'error',
          text: 'Error occurred! - Access Denied'
        })
      } else {
        this.idItem = id
        this.isVisibleShare = true
        this.isLoading = true
        this.isLoadingShare = false
        this.accounts = []
        const res = await getAccounts()
        if (res.code === '200') {
          this.config = res.data
          this.opsAccount = res.data.map((item) => {
            return { value: item.id, label: item.username }
          })
          this.isLoading = false
        }
      }
    },
    onClose () {
      this.isVisibleShare = false
    },
    async onShare () {
      if (this.accounts !== []) {
        try {
          this.isVisibleShare = true
          this.isLoadingShare = true
          const data = {
            requestId: this.idItem,
            accountIds: this.accounts
          }
          const res = await shareEtl(data)
          this.isLoadingShare = false
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Share ETL succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Share ETL failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Error occurred!' })
        } finally {
          this.isVisibleShare = false
        }
      }
    }
  }
}
</script>

<style></style>
