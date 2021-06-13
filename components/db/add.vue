<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-modal v-model="isVisible" title="Create Database" hide-footer>
    <b-row>
      <b-col>
        <label class="form-label">Host</label>
        <b-form-select
          v-model="config.serverInforId"
          :options="options"
          size="sm"
        ></b-form-select>
      </b-col>
      <b-col>
        <label class="form-label">Port</label>
        <b-input size="sm" v-model="config.port" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="form-label">Database</label>
        <b-input size="sm" v-model="config.databaseName" />
        <label class="form-label">User</label>
        <b-input size="sm" v-model="config.username" />
        <label class="form-label">Password</label>
        <b-input size="sm" v-model="config.password" type="password" />
        <label class="form-label">Database Type</label>
        <b-form-select
          v-model="config.databaseType"
          :options="dbTypes"
          size="sm"
        ></b-form-select>
      </b-col>
    </b-row>
    <b-row class="pt-3">
      <b-col>
          <b-button size="sm" variant="outline-primary" @click="checkConnectionStatus">
            <b-spinner v-if="isLoadingCheck" variant="primary" small></b-spinner>
            <i v-if="isConnected" class="fas fa-check"></i>
            Check connection
          </b-button>
      </b-col>
      <b-col class="text-right">
          <b-button size="sm" variant="primary" @click='createDatabaseInfo'>
            <b-spinner v-if="isLoadingCreate" variant="primary" small></b-spinner>
            Create
          </b-button>
      </b-col>
    </b-row>
    </b-modal>
    </div>
  </div>
</template>

<script>
import { createDatabase, checkConnection } from '@/service/db'
import { getAllServers } from '@/service/server'

export default {
  data: () => ({
    options: [],
    dbTypes: [
      { value: null, text: 'Please select an option' },
      { value: 'mysql', text: 'My Sql' },
      { value: 'mongoDB', text: 'Mongo DB' },
      { value: 'PostgreSQL', text: 'PostgreSQL' },
      { value: 'SQL-Sever', text: 'SQL-Sever' }
    ],
    config: {
      serverInforId: 0,
      port: 3306,
      databaseName: 'example',
      username: 'root',
      password: 'root',
      databaseType: null
    },
    isLoading: false,
    isLoadingCreate: false,
    isLoadingCheck: false,
    isConnected: false,
    isVisible: false
  }),

  async mounted () {
    this.isLoading = true
    const hosts = await getAllServers()
    this.options = hosts.data.map(item => {
      return { value: item.id, text: item.serverHost }
    })
    this.isLoading = false
  },

  methods: {
    async show () {
      this.isVisible = true
    },
    async createDatabaseInfo () {
      try {
        this.isLoadingCreate = true
        const res = await createDatabase(this.config)
        this.isLoadingCreate = false
        this.isVisible = false
        this.$emit('onAdded')
        if (res.code) {
          this.$notify({ type: 'success', text: 'Add successful' })
          // this.$router.push({ name: 'db-id', params: { id: res.id } })
        } else {
          this.$notify({ type: 'error', text: 'Add failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    },
    async checkConnectionStatus () {
      try {
        this.isLoadingCheck = true
        const res = await checkConnection(this.config)
        this.isConnected = res.success
        this.isLoadingCheck = false
      } catch (e) {}
    }
  }
}
</script>
