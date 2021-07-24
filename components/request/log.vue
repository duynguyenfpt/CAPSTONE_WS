<template>
  <b-modal v-model="isVisible" title="View Note" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <div v-for="(note, index) in shortNotes" :key="index">
        <div class="comment my-1">
          <div class="header pl-2 py-1">
            <span class="font-weight-bold">Linh Nguyễn</span>
            <span class="font-italic">commented on {{ format(new Date(note.id.time), `dd-mm-yyyy hh:mm`) }}</span>
          </div>
          <div class="pl-3 py-1">{{ note.content }}</div>
        </div>
      </div>
      <div v-if="isReadMore" class="mb-2" style="text-align: center;">
        <b-badge variant="primary" style="cursor: pointer;" @click="readMore()"
          >Read more ...</b-badge
        >
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
import { format } from 'date-fns'
export default {
  data: () => ({
    notes: [],
    shortNotes: [],
    isLoading: false,
    isVisible: false,
    isLoadingCreate: false,
    isReadMore: false,
    note: null,
    msg: null,
    format
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
        if (res.data.length > 6) {
          this.shortNotes = res.data.splice(0, 6)
          this.isReadMore = true
        } else {
          this.shortNotes = res.data
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isLoading = false
      }
    },
    readMore () {
      this.isReadMore = false
      this.shortNotes = this.notes
    },
    onClose () {
      this.isReadMore = false
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

<style scoped>
.comment {
  border: 1px solid #c1dbff;
  border-radius: 4px;
}
.comment .header {
  background-color: #e1efff;
}
.username {
  font-weight: 700;
}
</style>
