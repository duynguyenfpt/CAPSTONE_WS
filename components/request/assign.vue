<template>
<div v-if="!isDeny">
  <b-modal v-model="isVisible" title="Assign user" hide-footer>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <div>
        <el-select
          class="w-100"
          v-model="value"
          filterable
          default-first-option
          placeholder="Choose user"
          no-match-text="No data"
          no-data-text="No data"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <b-row class="pt-3">
        <b-col class="text-right">
          <b-button size="sm" variant="primary">Assign</b-button>
          <b-button size="sm" variant="light" @click="onClose">
            Cancel
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
  </div>
  <div v-else>
    <common-deny/>
  </div>
</template>
<script>
export default {
  data () {
    return {
      options: [
        {
          value: 'ducpv',
          label: 'Phan Văn Đức'
        },
        {
          value: 'linhntt',
          label: 'Nguyễn Thị Thùy Linh'
        },
        {
          value: 'longvt',
          label: 'Vũ Long'
        }
      ],
      value: [],
      isVisible: false
    }
  },
  methods: {
    onShow () {
      this.isVisible = true
    },
    onClose () {
      this.isVisible = false
    }
  }
}
</script>
