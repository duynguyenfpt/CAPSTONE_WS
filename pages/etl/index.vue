<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h1>ETL Request</h1>
      </b-col>
    </b-row>

    <div>
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="8" class="position-relative">
          <b-form-textarea
            class="autocomplete-input "
            placeholder="select :test.test: from :test:"
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
        <b-col sm="2"></b-col>
        <b-col sm="8">
          <b-form-checkbox>Is Repetitive</b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="8" class="text-right">
          <b-btn size="sm" variant="primary" class="btn-add-request">
            Summit
          </b-btn>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
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
        '::database'
      ],
      id: 'input-' + parseInt(Math.random() * 1000),
      inputValue: '',
      searchMatch: [],
      selectedIndex: 0,
      clickedChooseItem: false,
      wordIndex: 0
    }
  },
  methods: {
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
    inputValue () {
      this.focus()
      this.selectedIndex = 0
      this.wordIndex = this.inputSplitted.length - 1
    }
  }
}
</script>
<style scoped>
.autocomplete-input {
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}
.autocomplete-list {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  overflow: auto;
  min-width: 450px;
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
.autocomplete-list li:hover,
.active {
  background-color: #f5f5f5;
}
</style>
