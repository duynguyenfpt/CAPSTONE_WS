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
        <b-col sm="8">
          <b-form-textarea
          v-model="query"
          size="sm"
          placeholder="Query..."
          rows="8"></b-form-textarea>
          <p class="msg-error">{{ msg }}</p>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="8">
          <b-form-checkbox v-model="isRepetitive">Is Repetitive</b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col sm="2"></b-col>
        <b-col sm="8" class="text-right">
          <b-btn
            @click="addRequest"
            size="sm"
            variant="primary"
            class="btn-add-request"
          >
            <b-spinner
              v-if="isLoadingCreate"
              variant="primary"
              small
            ></b-spinner>
            Summit
          </b-btn>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
