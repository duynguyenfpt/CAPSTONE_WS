<template>
  <b-modal v-model="isVisible" title="Edit Database" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row>
        <b-col>
          <label class="form-label">Host</label>
          <b-form-select
            v-model="serverInforId"
            :options="options"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col>
          <label class="form-label">Port</label>
          <b-input size="sm" v-model="port" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label class="form-label">Database</label>
          <b-input size="sm" v-model="databaseName" />
          <p class="msg-error" v-if="msg">{{ msg }}</p>
          <label class="form-label">User</label>
          <b-input size="sm" v-model="username" />
          <label class="form-label">Password</label>
          <b-input size="sm" v-model="password" type="password" />
          <label class="form-label">Database Type</label>
          <b-form-select
            v-model="databaseType"
            :options="dbTypes"
            size="sm"
          ></b-form-select>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="primary" @click="onUpdateDB">
            <b-spinner v-if="isLoadingUpdate" variant="primary" small></b-spinner>Update</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import { getDatabaseDetail, updateDatabase } from '@/service/db'
import { getAllServers } from '@/service/server'

export default {
  data: () => ({
    options: [],
    dbTypes: [
      { value: 'mysql', text: 'My Sql' },
      { value: 'mongoDB', text: 'Mongo DB' },
      { value: 'PostgreSQL', text: 'PostgreSQL' },
      { value: 'SQL-Sever', text: 'SQL-Sever' }
    ],
    serverInforId: 0,
    port: 3306,
    databaseName: 'example',
    username: 'root',
    password: 'root',
    databaseType: null,
    isVisible: false,
    idItem: 0,
    isLoading: false,
    isLoadingUpdate: false,
    msg: null
  }),

  async mounted () {
    this.isLoading = true
    const hosts = await getAllServers()
    this.options = hosts.data.map(item => {
      return { value: item.id, text: item.serverHost }
    })
    this.isLoading = false
  },

  watch: {
    databaseName (value) {
      this.databaseName = value
      this.validateDBName(value)
    }
  },

  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      const res = await getDatabaseDetail(id)
      this.serverInforId = res.data.serverInfor.id
      this.port = res.data.port
      this.databaseName = res.data.databaseName
      this.username = res.data.username
      this.password = res.data.password
      this.databaseType = res.data.databaseType
      this.isLoading = false
    },
    validateDBName (value) {
      if (/^[a-zA-Z\d][\w#@]{0,127}$/.test(value)) {
        this.msg = ''
      } else {
        this.msg = 'Invalid database name'
      }
    },
    onClose () {
      this.isVisible = false
    },
    async onUpdateDB () {
      if (this.msg === '') {
        try {
          this.isLoadingUpdate = true
          const config = {
            port: this.port,
            username: this.username,
            password: this.password,
            databaseName: this.databaseName,
            databaseType: this.databaseType,
            serverInforId: this.serverInforId
          }
          const data = await updateDatabase(this.idItem, config)
          this.isLoadingUpdate = false
          this.isVisible = false
          this.$emit('onUpdated', data)
          if (data.code === '200') {
            this.$notify({ type: 'success', text: 'Update database succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Update database failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        }
      }
    }
  }
}
</script>

<style></style>
