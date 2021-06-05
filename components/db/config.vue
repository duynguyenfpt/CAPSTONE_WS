<template>
  <div>
    <b-row>
      <b-col>
        <label class="form-label">Host</label>
        <b-input size="sm" v-model="config.host" placeholder="Db host url"/>
      </b-col>
      <b-col>
        <label class="form-label">Port</label>
        <b-input size="sm" v-model="config.port"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label class="form-label">Database</label>
        <b-input size="sm" v-model="config.database"/>
        <label class="form-label">User</label>
        <b-input size="sm" v-model="config.user"/>
        <label class="form-label">Password</label>
        <b-input size="sm" v-model="config.password" type="password"/>
        <label class="form-label">Database Type</label>
        <SingleSelectDBType v-model="config.dataType" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SingleSelectDBType from '@/components/db/singleSelectDBType.vue'

export default {
  components: { SingleSelectDBType },
  data: () => ({
    config: {
      host: 'localhost',
      port: 3306,
      database: 'example',
      user: 'root',
      password: 'root',
      dataType: null
    }
  })
}
</script>

<style></style>
