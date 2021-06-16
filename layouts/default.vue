<template>
  <div>
    <b-row no-gutters>
      <b-col cols="2" class="w-100 side-nav-container">
        <b-nav vertical class="side-nav w-100 p-3">
          <h4 href="/">Capstone</h4>
          <hr />
          <b-nav-item v-b-toggle.db>
            <i class="fa fa-server mr-1" /> Databases config
            <b-collapse id="db">
              <b-nav-item :to="{ name: 'db' }">
                <i class="fa fa-list-ol" />
                List Databases
              </b-nav-item>
            </b-collapse>
          </b-nav-item>

          <b-nav-item v-b-toggle.table>
            <i class="fa fa-table mr-1"></i> Tables config
            <b-collapse id="table">
              <b-nav-item :to="{ name: 'table' }">
                <i class="fa fa-list-ol" />
                List Tables
              </b-nav-item>
              <b-nav-item :to="{ name: 'table-add' }">
                <i class="fa fa-plus" />
                Add Tables
              </b-nav-item>
            </b-collapse>
          </b-nav-item>
          <b-nav-item>
            <i class="fa fa-server mr-1"/>Sever config
          </b-nav-item>
           <b-nav-item>
            <i class="fa fa-user mr-1"/>Job
          </b-nav-item>
            <b-nav-item v-b-toggle.request>
            <i class="fa fa-check mr-1"></i> Request
            <b-collapse id="request">
              <b-nav-item :to="{ name: 'request' }">
                <i class="fa fa-list-ol" />
                List Request
              </b-nav-item>
              <b-nav-item :to="{ name: 'request-add' }">
                <i class="fa fa-plus" />
                Add Request
              </b-nav-item>
            </b-collapse>
          </b-nav-item>
          <hr />
        </b-nav>
      </b-col>
      <b-col>
        <b-navbar toggleable="lg" type="dark" variant="light" sticky>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item href="#">EN</b-dropdown-item>
              <b-dropdown-item href="#">ES</b-dropdown-item>
              <b-dropdown-item href="#">RU</b-dropdown-item>
              <b-dropdown-item href="#">FA</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>User</em>
              </template>
              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-navbar>
        <div id="__root" class="content-container">
          <nuxt class="content" />
          <notifications :duration="5000" />
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      collapsed: false
    }
  }
}
</script>
<style scoped>
.side-nav-container {
  position: relative;
  border-right: 1px solid black;
}

.side-nav {
  position: fixed;
  background: #2c2e5f;
  color: white;
  height: 100vh;
}
.content-container {
  padding: 20px;
  background: rgb(240, 242, 245);
}

.content {
  padding: 10px;
  background: white;
  min-height: 100vh;
}

.side-nav >>> a {
  color: white !important;
}

.side-nav >>> .disabled {
  color: rgb(153, 153, 153) !important;
}

.side-nav >>> a:hover {
  color: rgb(124, 137, 255) !important;
}
</style>
