<template>
<div>
  <b-modal v-model="isVisible" title="View Note" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <div v-if="isReadMore" class="mb-2" style="text-align: center;">
        <b-badge variant="primary" style="cursor: pointer;" @click="readMore()"
          >Read more ...</b-badge
        >
      </div>
      <div v-for="(note, index) in shortNotes" :key="index">
        <div class="comment my-1">
          <div class="header pl-2 py-1">
            <span class="font-weight-bold">{{ note.createdBy }}</span>
            <span class="font-italic">commented on {{ format(new Date(note.id.time), `yyyy-MM-dd`) }}</span>
          </div>
          <div class="pl-3 py-1">{{ note.content }}</div>
        </div>
      </div>
      <div class="create">
        <b-row>
          <b-col sm="12">
            <b-form-textarea
              id="textarea-small"
              size="sm"
              placeholder="Write note..."
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
              >Send</b-button
            >
            <b-button size="sm" variant="light" @click="onClose">
              Cancel
            </b-button>
          </b-col>
        </b-row>
      </div>
    </div>
  </b-modal>
  </div>
</template>

<script>
import { getLogByRequest, createLog } from '@/service/request'
import { format } from 'date-fns'
import { checkPermission } from '~/service/right'
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
    format,
    isDeny: false
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
      const dataGet = {
        method: 'GET',
        path: 'note'
      }
      const dataPost = {
        method: 'POST',
        path: 'note'
      }
      const resGet = await checkPermission(dataGet)
      const resPost = await checkPermission(dataPost)
      if (!resGet.data.success || !resPost.data.success) {
        this.$notify({ type: 'error', text: 'Error occurred! - Access Denied' })
      } else {
        this.idItem = id
        this.isVisible = true
        this.isLoading = true
        this.note = null
        this.msg = null
        try {
          const res = await getLogByRequest(this.idItem)
          if (res.code === '200') {
            this.notes = res.data
            if (res.data.length > 6) {
              this.shortNotes = res.data.splice(0, 6)
              this.isReadMore = true
            } else {
              this.shortNotes = res.data
            }
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Error occurred!' })
        } finally {
          this.isLoading = false
        }
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
          const res = await createLog(data)
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Add note succeeded' })
            await this.show(this.idItem)
          }
        } catch (e) {
          this.$notify({ type: 'error', text: 'Add note failed' })
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
