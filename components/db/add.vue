<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
    <b-row>
      <b-col>
        <label class="form-label">Host</label>
        <b-form-select
          v-model="config.server_infor_id"
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
        <b-input size="sm" v-model="config.database_name" />
        <label class="form-label">User</label>
        <b-input size="sm" v-model="config.username" />
        <label class="form-label">Password</label>
        <b-input size="sm" v-model="config.password" type="password" />
        <label class="form-label">Database Type</label>
        <b-form-select
          v-model="config.database_type"
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
      { value: 'mysql', text: 'My Sql' },
      { value: 'mongoDB', text: 'Mongo DB' },
      { value: 'PostgreSQL', text: 'PostgreSQL' },
      { value: 'SQL-Sever', text: 'SQL-Sever' }
    ],
    config: {
      server_infor_id: 0,
      port: 3306,
      database_name: 'example',
      username: 'root',
      password: 'root',
      database_type: null
    },
    isLoading: false,
    isLoadingCreate: false,
    isLoadingCheck: false,
    isConnected: false
  }),

  async mounted () {
    this.isLoading = true
    const hosts = await getAllServers()
    this.options = hosts.data.map(item => {
      return { value: item.id, text: item.server_host }
    })
    this.isLoading = false
  },

  methods: {
    async createDatabaseInfo () {
      try {
        this.isLoadingCreate = true
        const res = await createDatabase(this.config)
        this.isLoadingCreate = false
        if (res.id) {
          this.$router.push({ name: 'db-id', params: { id: res.id } })
        }
      } catch (e) {}
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
