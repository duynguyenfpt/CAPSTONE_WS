<template>
  <div class="container">
    <b-row>
      <b-col cols="6">
        <h3>Total request</h3>
        <home-chart-column />
      </b-col>
      <b-col cols="6">
        <h3>Success percentage recent week</h3>
        <home-chart-line />
      </b-col>
    </b-row>
    <div class="mt-6">
      <home-table />
    </div>
  </div>
</template>
