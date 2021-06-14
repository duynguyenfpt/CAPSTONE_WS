<template>
<div>
  <b-modal v-model="isVisible" title="Confirm" hide-footer>
      <b-row>
        <b-col>
          <p>Do you want to delete this database?</p>
        </b-col>
      </b-row>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="danger" @click="onDeleteDB">
            <b-spinner v-if="isLoading" variant="danger" small></b-spinner>Delete</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
  </b-modal>
</div>
</template>

<script>
import { deleteDatabaseDetail } from '@/service/db'
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
    async onDeleteDB () {
      try {
        this.isLoading = true
        const res = await deleteDatabaseDetail(this.idItem)
        this.isLoading = false
        this.isVisible = false
        this.$emit('onDeleted')
        if (res.code) {
          this.$notify({ type: 'success', text: 'Delete successful' })
        } else {
          this.$notify({ type: 'error', text: 'Delete failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    }
  }
}
</script>

<style></style>
