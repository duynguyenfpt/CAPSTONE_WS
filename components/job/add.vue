<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-modal v-model="isVisible" title="Create Job" hide-footer>
        <b-form-group
          label="Name:"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input size="sm" v-model="config.name"></b-form-input>
        </b-form-group>
        <b-form-group
          label="Creator:"
          label-cols-sm="3"
          label-align-sm="left"
          label-size="sm"
        >
          <b-form-input size="sm" v-model="config.creator"></b-form-input>
        </b-form-group>
        <b-row class="pt-3">
          <b-col class="text-right">
            <b-button size="sm" variant="primary" @click="createJob">
              <b-spinner
                v-if="isLoadingCreate"
                variant="primary"
                small
              ></b-spinner>
              Create
            </b-button>
            <b-button size="sm" variant="light" @click="onClose">
              Cancel
            </b-button>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      config: {
        name: null,
        creator: null
      },
      isLoading: false,
      isLoadingCreate: false,
      isVisible: false
    }
  },
  methods: {
    async show () {
      this.isVisible = true
    },
    async createJob () {
      try {
        this.isLoadingCreate = true
        const res = true
        this.isLoadingCreate = false
        this.isVisible = false
        this.$emit('onAdded')
        if (res.code) {
          this.$notify({ type: 'success', text: 'Create job succeeded' })
        } else {
          this.$notify({ type: 'error', text: 'Create job failed' })
        }
      } catch (e) {
        this.$notify({ type: 'error', text: e.message })
      }
    },
    onClose () {
      this.isVisible = false
    }
  }
}
</script>
