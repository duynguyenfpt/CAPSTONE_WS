<template>
  <div>
    <b-row>
      <b-col sm="1"></b-col>
      <b-col sm="8" class="text-center">
        <h1>ETL Request</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="9" class="text-right">
        <b-button size="sm" v-b-toggle.sidebar-right variant="success" @click="showAllResults">History</b-button>
      </b-col>
      <b-sidebar id="sidebar-right" title="Old Result" right shadow>
        <div class="px-2 py-2">
          <b-list-group>
            <b-list-group-item class="flex-column align-items-start" v-for="(item, index) in results" :key="index">
              <div style="cursor: pointer" @click="showResult(item.request.id)">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ item.queryType }}</h5>
                <small class="text-muted">{{ format(new Date(item.createdDate), `yyyy-mm-dd`) }}</small>
              </div>
              <p class="mb-1">
                {{ item.query }}
              </p>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">{{ item.createdBy }}</small>
                <b-button class="text-right" variant="primary" size="sm" @click="shareResult(item.id)">Share</b-button>
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
        <b-col sm="1"></b-col>
        <b-col sm="8" class="text-right">
          <b-btn size="sm" variant="primary" class="btn-add-request" @click="createETL" :disabled="!isExecuted">
            <b-spinner
                v-if="isLoadingCreate"
                variant="primary"
                small
              ></b-spinner>
            Submit
          </b-btn>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="1"></b-col>
        <b-col sm="8" v-if="isExecuted">
          <b-table
          responsive
          hover
          striped
          :items="rows"
          :fields="resultFields">
          <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
          </template>
          </b-table>
        </b-col>
        <b-col sm="8" v-else>
          <div class="text-center">
            <b-spinner :variant="variant" label="Text Centered"></b-spinner>
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
</template>
<script>
import { getAllResults, createEtl, getResultDetail } from '@/service/etl'
import { format } from 'date-fns'
export default {
  data () {
    return {
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
      variant: 'primary'
    }
  },
  methods: {
    async showAllResults () {
      const res = await getAllResults()
      this.results = res.data
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
    async createETL () {
      this.validateQuery(this.inputValue)
      if (this.message.query === '') {
        try {
          this.isLoadingCreate = true
          const data = {
            query: this.inputValue
          }
          const res = await createEtl(data)
          this.isLoadingCreate = false
          if (res.code === '201') {
            this.$notify({ type: 'success', text: 'Create ETL succeeded' })
            const id = res.data.request.id
            this.isExecuted = false
            this.variant = 'primary'
            let isRunning = true
            while (isRunning) {
              this.rows = []
              try {
                const resResult = await getResultDetail(id)
                if (resResult.code === '200') {
                  const totalArray = resResult.data.content.split('\n')
                  const header = []
                  if (resResult.data.status === 'successed') {
                    header.push({
                      key: 'no'
                    })
                    this.isExecuted = true
                    isRunning = false
                  } else {
                    if (resResult.data.status === 'failed') {
                      this.isExecuted = true
                      this.variant = 'danger'
                      this.msg = 'Query is failed'
                      isRunning = false
                    } else {
                      this.isExecuted = false
                      this.msg = 'Query is executing'
                    }
                  }
                  totalArray.forEach((element, index) => {
                    if (index === 0) {
                      // eslint-disable-next-line array-callback-return
                      element.split(',').map(item => {
                        header.push({
                          key: item
                        })
                      })
                    } else {
                      const tempRow = element.split(',')
                      const objData = {}
                      header.forEach((item, i) => {
                        if (item.key === 'no') {
                          objData[`${item.key}`] = index
                        } else {
                          objData[`${item.key}`] = tempRow[i - 1]
                        }
                      })
                      this.rows.push(objData)
                    }
                  })
                  this.resultFields = header
                  this.isLoadingCreate = false
                } else {
                  this.isExecuted = true
                  this.msg = 'Query is failed'
                }
              } catch (e) {
                this.isExecuted = true
                this.msg = 'Query is failed'
              }
              await this.sleep(10000)
            }
          } else {
            this.$notify({ type: 'error', text: 'Create ETL failed' })
          }
        } catch (e) {
          this.$notify({ type: 'error', text: e.message })
        } finally {
          this.isLoadingCreate = false
        }
      }
    },
    sleep (ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },
    validateQuery (value) {
      if (/^(?=.*select|create|drop|update|insert|alter|delete|attach|detach.*from).*$/.test(value)) {
        this.message.query = ''
      } else {
        this.message.query = 'Invalid etl'
      }
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
</style>
