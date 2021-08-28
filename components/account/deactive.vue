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
            <b-spinner v-if="isLoading" variant="danger" small></b-spinner
            >Deactive</b-button
          >
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
import { checkPermission } from '@/service/right'
export default {
  data: () => ({
    isVisible: false,
    idItem: 0,
    isLoading: false
  }),
  methods: {
    async show (id) {
      const data = {
        method: 'PUT',
        path: 'account'
      }
      const res = await checkPermission(data)
      if (!res.data.success) {
        this.$notify({
          type: 'error',
          text: 'Error occurred! - Access Denied'
        })
      } else {
        this.idItem = id
        this.isVisible = true
      }
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
        if (res.code === '200') {
          this.$notify({
            type: 'success',
            text: 'Deactive account succeeded'
          })
        } else {
          this.$notify({ type: 'error', text: 'Deactive account  failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: 'Deactive account  failed' })
      } finally {
        this.isLoading = false
        this.isVisible = false
      }
    }
  }
}
</script>

<style></style>
