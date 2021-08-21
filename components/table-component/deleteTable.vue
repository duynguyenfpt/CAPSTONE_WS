<template>
<div v-if="!isDeny">
  <b-modal v-model="isVisible" title="Confirm" hide-footer>
      <b-row>
        <b-col>
          <p>Do you want to delete this table?</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="danger" @click="onDeleteTb">
            <b-spinner v-if="isLoading" variant="danger" small></b-spinner>Delete</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
  </b-modal>
</div>
<div v-else>
  <common-deny/>
</div>
</template>

<script>
import { deleteTableDetail } from '@/service/table.service'
export default {
  data: () => ({
    isVisible: false,
    idItem: 0,
    isLoading: false,
    isDeny: false
  }),
  methods: {
    async show (id) {
      this.idItem = id
      this.isVisible = true
    },
    onClose () {
      this.isVisible = false
    },
    async onDeleteTb () {
      try {
        this.isLoading = true
        const res = await deleteTableDetail(this.idItem)
        if (res.statusCode === '403') {
          this.isDeny = true
        } else {
          this.isLoading = false
          this.isVisible = false
          this.$emit('onDeleted')
          if (res.code === '200') {
            this.$notify({ type: 'success', text: 'Delete table succeeded' })
          } else {
            this.$notify({ type: 'error', text: 'Delete table failed' })
          }
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
        this.isLoading = false
        this.isVisible = false
      }
    }
  }
}
</script>

<style></style>
