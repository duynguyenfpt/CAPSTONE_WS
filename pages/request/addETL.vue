<template>
  <div v-if="!isDeny">
    <b-row>
      <b-col sm="1"></b-col>
      <b-col sm="8" class="text-center">
        <h1>ETL Request</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="9" class="text-right">
        <b-button
          size="sm"
          v-b-toggle.sidebar-right
          variant="info"
          @click="showAllResults"
        >
          <i class="fa fa-history" />
          History
        </b-button>
      </b-col>
      <b-sidebar id="sidebar-right" title="Old Result" right shadow>
        <div class="px-2 py-2">
          <b-list-group>
            <b-list-group-item
              class="flex-column align-items-start"
              v-for="(item, index) in results"
              :key="index"
            >
              <div
                style="cursor: pointer; overflow: hidden; text-overflow: ellipsis;"
                @click="showResult(item.request.id)"
                @contextmenu="copyToClipboard($event, item.query)"
              >
                <div class="d-flex w-100 justify-content-between">
                  <b-badge variant="processing" class="mb-1">{{
                    index + 1
                  }}</b-badge>
                  <small class="text-muted">{{
                    format(new Date(item.createdDate), `yyyy-MM-dd`)
                  }}</small>
                </div>
                <p class="mb-1">
                  {{ item.query }}
                </p>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">{{ item.createdBy }}</small>
                <b-button
                  class="text-right"
                  variant="primary"
                  size="sm"
                  @click="shareResult(item.id)"
                  >Share</b-button
                >
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-sidebar>
    </b-row>
    <div>
      <b-row class="pt-2">
        <b-col sm="1"></b-col>
        <b-col sm="8" class="position-relative">
          <b-form-textarea
            class="autocomplete-input "
            placeholder="select * from :test:"
            rows="8"
            @focusout="focusout"
            @focus="focus"
            @keydown.13="chooseItem"
            @keydown.tab="chooseItem"
            @keydown.40="moveDown"
            @keydown.38="moveUp"
            v-model="inputValue"
            type="text"
          ></b-form-textarea>
          <p class="msg-error" v-if="message.query">{{ message.query }}</p>
          <ul
            :class="{
              'autocomplete-list': true,
              [id + '-list']: true,
            }"
            v-if="searchMatch.length > 0"
          >
            <li
              :class="{ active: selectedIndex === index }"
              v-for="(result, index) in searchMatch"
              :key="index"
              @click="selectItem(index), chooseItem()"
              v-html="highlightWord(result)"
            ></li>
          </ul>
          <!-- <p class="msg-error">{{ msg }}</p> -->
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="1"></b-col>
        <b-col sm="8">
          <b-form-checkbox>Is Repetitive</b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col cols="1" />
        <b-col cols="4">
          <b-btn variant="warning" @click="onDownload" v-if="isDisplay">
            <i v-if="isDownload" class="fa fa-spin fa-spinner" />
            <i v-else class="fa fa-download" />
            Download
          </b-btn>
        </b-col>
        <b-col sm="4" class="text-right">
          <b-btn
            variant="success"
            class="btn-add-request"
            @click="submitETL"
            :disabled="!isExecuted"
          >
            <i v-if="isLoadingCreate" class="fa fa-spin fa-spinner" />
            <i v-else class="fa fa-play" />
            Submit
          </b-btn>
        </b-col>
      </b-row>
      <hr />
      <b-row class="pt-2">
        <b-col cols="12" v-if="isExecuted">
          <div v-if="isSuccess">
            <h4 class="text-center" v-if="isDisplay">Sample Data</h4>
            <b-table
              small
              class="w-100"
              responsive
              hover
              striped
              bordered
              :items="rows"
              :fields="resultFields"
            >
              <template #table-busy>
                <div class="text-center text-danger my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>
            </b-table>
          </div>
          <div v-if="isFailed">
            <h5 class="text-center msg-fail">{{ msgErr }}</h5>
            <p class="msg-fail">{{ msgFailed }}</p>
          </div>
        </b-col>
        <b-col sm="8" v-else>
          <div class="text-center">
            <b-spinner variant="primary" label="Text Centered"></b-spinner>
            <h5>{{ msg }}</h5>
          </div>
        </b-col>
      </b-row>
    </div>
    <section name="popup">
      <etl-result ref="result" />
    </section>
    <section name="popup">
      <etl-share ref="share" />
    </section>
  </div>
  <div v-else>
    <common-deny />
  </div>
</template>
<script>
import {
  getAllResults,
  createEtl,
  getResultDetail,
  downloadData
} from '@/service/etl'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'

export default {
  data () {
    return {
      eltID: null,
      query: null,
      standardItems: [
        'select',
        'from',
        'join',
        'union',
        'table',
        'database',
        ':table',
        ':database'
      ],
      id: 'input-' + parseInt(Math.random() * 1000),
      inputValue: '',
      searchMatch: [],
      selectedIndex: 0,
      clickedChooseItem: false,
      wordIndex: 0,
      results: [],
      format,
      resultFields: [],
      rows: [],
      isLoadingCreate: false,
      isExecuted: true,
      msg: '',
      message: {
        query: ''
      },
      isFailed: false,
      msgFailed: '',
      msgErr: '',
      isDownload: false,
      isDisplay: false,
      isSuccess: false,
      isDeny: false
    }
  },
  methods: {
    async showAllResults () {
      const res = await getAllResults()
      if (res.statusCode === '403') {
        this.isDeny = true
      } else {
        this.results = res.data
      }
    },
    showResult (id) {
      this.$refs.result.show(id)
    },
    shareResult (id) {
      this.$refs.share.show(id)
    },
    highlightWord (word) {
      const regex = new RegExp('(' + this.currentWord + ')', 'g')
      return word.replace(regex, '<mark>$1</mark>')
    },
    setWord (word) {
      const currentWords = this.inputValue
        .replace(/(\r\n|\n|\r)/gm, '__br__ ')
        .split(' ')
      currentWords[this.wordIndex] = currentWords[this.wordIndex].replace(
        this.currentWord,
        word + ' '
      )
      this.wordIndex += 1
      this.inputValue = currentWords.join(' ').replace(/__br__\s/g, '\n')
    },
    moveDown () {
      if (this.selectedIndex < this.searchMatch.length - 1) {
        this.selectedIndex++
      }
    },
    moveUp () {
      if (this.selectedIndex !== -1) {
        this.selectedIndex--
      }
    },
    selectItem (index) {
      this.selectedIndex = index
      this.chooseItem()
    },
    chooseItem (e) {
      this.clickedChooseItem = true

      if (this.selectedIndex !== -1 && this.searchMatch.length > 0) {
        if (e) {
          e.preventDefault()
        }
        this.setWord(this.searchMatch[this.selectedIndex])
        this.selectedIndex = -1
      }
    },
    focusout (e) {
      setTimeout(() => {
        if (!this.clickedChooseItem) {
          this.searchMatch = []
          this.selectedIndex = -1
        }
        this.clickedChooseItem = false
      }, 100)
    },
    focus () {
      this.searchMatch = []
      if (this.currentWord !== '') {
        this.searchMatch = this.listToSearch.filter(
          (el) => el.indexOf(this.currentWord) >= 0
        )
      }
      if (
        this.searchMatch.length === 1 &&
        this.currentWord === this.searchMatch[0]
      ) {
        this.searchMatch = []
      }
    },

    reset () {
      this.msgFailed = ''
      this.msgErr = ''
      this.eltID = null
    },

    async submitETL () {
      this.reset()
      if (!this.validateQuery(this.inputValue)) return

      this.isLoadingCreate = true
      this.isFailed = false
      try {
        const res = await createEtl({ query: this.inputValue })
        if (res.statusCode === '403') {
          this.isDeny = true
          throw new Error('query denied')
        }
        this.isLoadingCreate = false
        if (res.code !== '201') return
        this.$notify({ type: 'success', text: 'Create ETL succeeded' })

        const id = res.data.request.id
        this.eltID = id
        let isRunning = true

        this.rows = []
        this.msg = 'Query is executing'
        this.isExecuted = false
        while (isRunning) {
          try {
            const result = await getResultDetail(id)
            if (result.statusCode === '403') {
              this.isDeny = true
              throw new Error('query denied')
            }
            if (result.code !== '200') return

            switch (result.data.status) {
              case 'failed':
                this.isFailed = true
                this.isExecuted = true
                this.isSuccess = false
                throw new Error(result.data.content)
              case 'successed': {
                const headers = [{ key: 'no', class: 'align-top' }]
                const arr = result.data.content.split('\n')
                arr.forEach((row, idx) => {
                  if (idx === 0) {
                    row.split(',').forEach((e) => {
                      headers.push({ key: e, class: 'align-top' })
                    })
                    return
                  }
                  const tmp = row.split(',')
                  const data = {}
                  headers.forEach((header, idx) => {
                    if (header.key === 'no') {
                      data[header.key] = idx
                    } else {
                      data[header.key] = tmp[idx - 1]
                    }
                  })
                  this.rows.push(data)
                })
                this.isExecuted = true
                this.resultFields = headers
                isRunning = false
                this.isDisplay = true
                this.isSuccess = true
              }
            }
          } catch (e) {
            isRunning = false
            throw e
          }
          await this.sleep(2000)
        }
      } catch (e) {
        this.isFailed = true
        this.msgErr = 'Query is failed'
        this.msgFailed = e.message
        this.isSuccess = false
      } finally {
        this.isLoadingCreate = false
      }
    },
    async onDownload () {
      if (!this.eltID) return
      try {
        this.isDownload = true
        const res = await downloadData(this.eltID)
        console.log(res)
        const blob = new Blob([res], { type: 'text/plain;charset=utf-8' })
        console.log('blob')
        const name = `${new Date().getTime()}.csv`
        console.log(name)
        saveAs(blob, name)
        console.log('save')
        this.$notify({
          type: 'success',
          text: 'Download result succeeded'
        })
        console.log('notify')
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      } finally {
        this.isDownload = false
      }
    },
    sleep (ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },
    validateQuery (value) {
      if (/^(\s*)$/.test(value)) {
        this.message.query = 'Invalid etl'
        return false
      } else {
        this.message.query = ''
        return true
      }
    },

    copyToClipboard (e, text) {
      e.preventDefault()
      this.$notify({ type: 'info', text: 'Copied to clipboard' })
      this.inputValue = text
      navigator.clipboard.writeText(text)
    }
  },
  computed: {
    listToSearch () {
      if (typeof this.items !== 'undefined' && this.items.length > 0) {
        return this.items
      } else {
        return this.standardItems
      }
    },
    currentWord () {
      return this.inputValue.replace(/(\r\n|\n|\r)/gm, ' ').split(' ')[
        this.wordIndex
      ]
    },
    inputSplitted () {
      return this.inputValue.replace(/(\r\n|\n|\r)/gm, ' ').split(' ')
    }
  },
  watch: {
    inputValue (value) {
      this.focus()
      this.selectedIndex = 0
      this.wordIndex = this.inputSplitted.length - 1
      this.inputValue = value
      this.validateQuery(value)
    }
  }
}
</script>
<style scoped>
.autocomplete {
  position: relative;
}
.autocomplete-input {
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}
.autocomplete-input :focus {
  border-color: #000;
}
.autocomplete-list {
  position: relative;
  z-index: 2;
  overflow: auto;
  min-width: 250px;
  max-height: 150px;
  margin: 0;
  margin-top: 5px;
  padding: 0;
  border: 1px solid #eee;
  list-style: none;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
}
.autocomplete-list li {
  margin: 0;
  padding: 8px 15px;
  border-bottom: 1px solid #f5f5f5;
}
.autocomplete-list li :last-child {
  border-bottom: 0;
}
.autocomplete-list li :hover,
.active {
  background-color: #f5f5f5;
}

.msg-fail {
  color: red;
}
</style>
