<template>
  <div>
    <b-row no-gutters>
      <b-col cols="2" class="w-100 side-nav-container">
        <b-nav vertical class="side-nav w-100 p-3">
          <router-link to="/" class="link">FTDS System</router-link>
          <b-nav-item v-b-toggle.right :to="{ name: 'right' }">
            <i class="fas fa-balance-scale-right"/> Rights
          </b-nav-item>
          <b-nav-item v-b-toggle.account :to="{ name: 'account' }">
            <i class="fa fa-user mr-1" /> Accounts
          </b-nav-item>
          <b-nav-item v-b-toggle.db :to="{ name: 'db' }">
            <i class="fa fa-database mr-1" /> Databases
          </b-nav-item>
          <b-nav-item v-b-toggle.table :to="{ name: 'table' }">
            <i class="fa fa-table mr-1"></i> Tables
            <b-collapse id="table">
              <b-nav-item :to="{ name: 'table-add' }">
                <i class="fa fa-plus" />
                Add Table
              </b-nav-item>
              <b-nav-item :to="{ name: 'table-changeHistory' }">
                <i class="fa fa-circle" />
                Change Log
              </b-nav-item>
            </b-collapse>
          </b-nav-item>
          <b-nav-item v-b-toggle.server :to="{ name: 'server' }">
            <i class="fa fa-server mr-1" />
            Servers
          </b-nav-item>
          <b-nav-item v-b-toggle.job :to="{ name: 'job' }">
            <i class="fa fa-user mr-1" />
            Jobs
          </b-nav-item>
          <b-nav-item v-b-toggle.request :to="{ name: 'request' }">
            <i class="fa fa-check mr-1"></i> Requests
            <b-collapse id="request">
              <b-nav-item :to="{ name: 'request-add' }">
                <i class="fa fa-plus" />
                Add Request
              </b-nav-item>
            </b-collapse>
          </b-nav-item>
          <b-nav-item v-b-toggle.log :to="{ name: 'log' }">
            <i class="fas fa-notes-medical mr-1" />
            Logs
          </b-nav-item>
          <hr />
        </b-nav>
      </b-col>
      <b-col>
        <b-navbar toggleable="sm" variant="light" sticky>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <b-img
                  src="~@/assets/images/user.png"
                  class="account-profile"
                ></b-img>
              </template>
              <b-dropdown-item class="card-info">
                <div class="account-info">
                  <b-row>
                    <b-col cols="8" class="text-12">Admin</b-col>
                    <b-col class="text-right">
                      <a id="account-link" class="text-12" @click="logout">Sign Out</a>
                    </b-col>
                  </b-row>
                  <b-row class="account-detail">
                    <b-col cols="3">
                      <b-img
                        src="~@/assets/images/user.png"
                        class="account-img"
                      ></b-img>
                    </b-col>
                    <b-col class="info-detail" v-if="user">
                      <h6>{{ user.username }}</h6>
                      <p class="text-12">{{ user.email }}</p>
                      <b-link class="text-12" :to="{ name: 'password-change' }">Change password</b-link>
                    </b-col>
                  </b-row>
                </div>
              </b-dropdown-item>
              <!-- <b-dropdown-item href="#">Sign Out</b-dropdown-item> -->
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
import { mapGetters } from 'vuex'
export default {
  middleware: 'isAuthenticated',
  data () {
    return {
      collapsed: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    })
  },
  methods: {
    async logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
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

.account-profile {
  width: 35px;
  padding: 3px;
  border-radius: 50%;
  border: 2px solid #2c2e5f;
}

.sticky-top {
  padding: 0;
  padding-top: 5px;
}

.card-info {
  width: 350px;
  height: auto;
}

.card-info :hover {
  background-color: #fff;
}

#account-link {
  text-decoration: none;
  color: #212529;
}

.account-img {
  width: 75px;
  border-radius: 50%;
}

.account-detail {
  margin-top: 15px;
}

.info-detail {
  margin-left: 15px;
}

.text-12 {
  font-size: 13px;
  margin: 0;
  text-decoration: none;
}

.link {
  font-size: 1.5rem;
  text-decoration: none;
  color: #fff;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}

.link :hover {
  color: #fff;
}
</style>
