<template>
  <div>
    <h1>Add table</h1>
    <!-- <b-dropdown text="Select Database" variant="outline-primary">
            <b-dropdown-item>Db 1</b-dropdown-item>
      </b-dropdown> -->

     <b-row>
      <b-col>
        <label>Select Database</label>
    <b-form-select v-model="dbInfoList" :options="dbInfoOption" size="sm">
    </b-form-select>
      </b-col>
      <b-col>
        <label>Database Name</label>
        <b-input size="sm"></b-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Host</label>
        <b-input size="sm"></b-input>
      </b-col>
      <b-col>
        <label>Post</label>
        <b-input size="sm"></b-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Username</label>
        <b-input size="sm"></b-input>
      </b-col>
      <b-col>
        <label>Password</label>
        <b-input size="sm"></b-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <label>Table Name</label>
        <b-input size="sm"></b-input>
      </b-col>
      <b-col>
        <label>Database Type</label>
        <b-form-select v-model="selected" :options="dbTypes" size="sm">
        </b-form-select>
      </b-col>
    </b-row>
    <b-row class="pt-2">
      <b-col class="text-right">
        <b-button size="sm" variant="primary">
          <b-spinner v-if="isLoadingCreate" variant="primary" small></b-spinner>
          Add Table
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: null,
      dbTypes: [
        { value: null, text: 'Please select an option' },
        { value: 'mysql', text: 'My Sql' },
        { value: 'mongoDB', text: 'Mongo DB' },
        { value: 'PostgreSQL', text: 'PostgreSQL' },
        { value: 'SQL-Sever', text: 'SQL-Sever' }
      ],
      dbInfoList: null,
      dbInfoOption: [
        { value: null, text: 'Please select an option' },
        { value: 'mysql', text: 'My Sql' },
        { value: 'mongoDB', text: 'Mongo DB' },
        { value: 'PostgreSQL', text: 'PostgreSQL' },
        { value: 'SQL-Sever', text: 'SQL-Sever' }
      ]
    }
  }
}
</script>

<style></style>
