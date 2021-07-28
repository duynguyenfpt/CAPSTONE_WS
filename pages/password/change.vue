<template>
  <div>
    <b-row class="pt-2">
      <b-col class="text-center">
        <h2>Change Password</h2>
      </b-col>
    </b-row>
    <b-form class="form-change">
      <b-form-group
        label="Current password"
      >
        <b-form-input
          v-model="currentPass"
          type="password"
        ></b-form-input>
        <p class="msg-error" v-if="msg.current">{{ msg.current }}</p>
      </b-form-group>

      <b-form-group
        label="New password"
      >
        <b-form-input
          v-model="newPass"
          type="password"
        ></b-form-input>
        <p class="msg-error" v-if="msg.new">{{ msg.new }}</p>
      </b-form-group>

      <b-form-group
        label="Confirm password"
      >
        <b-form-input
          v-model="confirmPass"
          type="password"
        ></b-form-input>
        <p class="msg-error" v-if="msg.confirm">{{ msg.confirm }}</p>
      </b-form-group>
      <b-form-group class="text-center">
        <b-button type="submit" variant="primary" @click="onChange">
          <b-spinner v-if="isLoading" variant="primary" small></b-spinner>
          Change</b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPass: null,
      newPass: null,
      confirmPass: null,
      msg: {
        current: null,
        new: null,
        confirm: null
      },
      isLoading: false
    }
  },
  watch: {
    currentPass (value) {
      this.currentPass = value
      this.validateCurrent(value)
    },
    newPass (value) {
      this.newPass = value
      this.validateNew(value)
    },
    confirmPass (value) {
      this.confirmPass = value
      this.validateConfirm(value)
    }
  },
  methods: {
    validateCurrent (value) {
      if (/^[\w#@]{6,127}$/.test(value)) {
        this.msg.current = ''
      } else {
        this.msg.current = 'Invalid password'
      }
    },
    validateNew (value) {
      if (/^[\w#@]{6,127}$/.test(value)) {
        this.msg.new = ''
      } else {
        this.msg.new = 'Invalid password'
      }
    },
    validateConfirm (value) {
      if (value === this.newPass) {
        this.msg.confirm = ''
      } else {
        this.msg.confirm = 'Password mismatch'
      }
    },
    onChange () {

    }
  }
}
</script>

<style></style>
