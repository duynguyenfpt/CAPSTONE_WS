<template>
  <b-modal v-model="isVisible" title="Log Note" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <div class="info" v-for="note in notes" :key="note.content">
        <p><strong>Username: </strong> {{ note.content }}</p>
      </div>
      <div class="create">
        <b-row>
          <b-col sm="12">
            <b-form-textarea
              id="textarea-small"
              size="sm"
              placeholder="Log Note"
              v-model="note"
            ></b-form-textarea>
          </b-col>
        </b-row>
        <p class="msg-error" v-if="msg">{{ msg }}</p>
        <b-row class="pt-3">
          <b-col class="text-right">
            <b-button
              size="sm"
              variant="primary"
              @click="createLog"
              class="btn-add-request"
            >
              <b-spinner
                v-if="isLoadingCreate"
                variant="primary"
                small
              ></b-spinner
              >Log</b-button
            >
            <b-button size="sm" variant="light" @click="onClose">
              Cancel
            </b-button>
          </b-col>
        </b-row>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { getLogByRequest, createLog } from '@/service/request'
export default {
  data: () => ({
    notes: [],
    isLoading: false,
    isVisible: false,
    isLoadingCreate: false,
    note: null,
    msg: null
  }),
  methods: {
    validateNote (value) {
      if (this.note === null) {
        this.msg = 'Please fill note before'
      } else {
        this.msg = ''
      }
    },
    async show (id) {
      this.idItem = id
      this.isVisible = true
      this.isLoading = true
      this.note = null
      this.msg = null
      try {
        const res = await getLogByRequest(this.idItem)
        this.notes = res.data
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoading = false
      }
    },
    onClose () {
      this.isVisible = false
    },
    async createLog () {
      this.validateNote(this.note)
      if (this.msg === '') {
        try {
          const data = {
            requestId: this.idItem,
            content: this.note
          }
          createLog(data)
          this.show(this.idItem)
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        } finally {
          this.isLoadingCreate = false
        }
      }
    }
  }
}
</script>

<style></style>
