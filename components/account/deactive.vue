<template>
<div>
  <b-modal v-model="isVisible" title="Confirm" hide-footer>
      <b-row>
        <b-col>
          <p>Do you want to deactive for this account?</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="danger" @click="onActive">
            <b-spinner v-if="isLoading" variant="danger" small></b-spinner>Deactive</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
  </b-modal>
</div>
</template>

<script>
import { deactiveAccount } from '@/service/account'
export default {
  data: () => ({
    isVisible: false,
    idItem: 0,
    isLoading: false
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
    },
    onClose () {
      this.isVisible = false
    },
    async onActive () {
      try {
        this.isLoading = true
        const active = {
          active: false
        }
        const res = await deactiveAccount(this.idItem, active)
        this.$emit('onDeactived')
        if (res.code) {
          this.$notify({ type: 'success', text: 'Deactive account succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Deactive account  failed' })
          this.$router.go()
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoading = false
        this.isVisible = false
      }
    }
  }
}
</script>

<style></style>
