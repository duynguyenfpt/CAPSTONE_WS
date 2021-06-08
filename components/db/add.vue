<template>
  <div>
    <b-row>
      <b-col>
        <label class="form-label">Host</label>
        <b-form-select
          v-model="selected"
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
          <b-button size="sm" variant="outline-primary">Check connection</b-button>
      </b-col>
      <b-col class="text-right">
          <b-button size="sm" variant="primary" @click='createDatabaseInfo'>Create</b-button>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import { createDatabase } from '@/service/db'

export default {
  data: () => ({
    selected: 'localhost',
    options: [
      { value: 'localhost', text: 'localhost' },
      { value: '10.12.16.19', text: '10.12.16.19' },
      { value: '10.12.16.20', text: '10.12.16.20' }
    ],
    databaseTypeSelect: 'mysql',
    dbTypes: [
      { value: 'mysql', text: 'My Sql' },
      { value: 'mongoDB', text: 'Mongo DB' },
      { value: 'PostgreSQL', text: 'PostgreSQL' },
      { value: 'SQL-Sever', text: 'SQL-Sever' }
    ],
    config: {
      port: 3306,
      database_name: 'example',
      username: 'root',
      password: 'root',
      database_type: null
    }
  }),

  methods: {
    async createDatabaseInfo () {
      try {
        const res = await createDatabase(this.config)
        console.log(res)
        if (res.id) {
          this.$router.push({ name: 'db-id', params: { id: res.id } })
        }
      } catch (e) {}
    }
  }
}
</script>

<style></style>
