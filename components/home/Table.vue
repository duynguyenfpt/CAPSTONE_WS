<template>
  <div>
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { no: 1, jobId: 'Job_1', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' },
        { no: 2, jobId: 'Job_2', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' },
        { no: 3, jobId: 'Job_3', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' },
        { no: 4, jobId: 'Job_4', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' },
        { no: 5, jobId: 'Job_5', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' },
        { no: 6, jobId: 'Job_6', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' },
        { no: 7, jobId: 'Job_7', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' },
        { no: 8, jobId: 'Job_8', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' },
        { no: 9, jobId: 'Job_9', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' },
        { no: 10, jobId: 'Job_10', jobType: 'Sync Table', database: 'test', table: 'test', status: 'fail' }
      ]
    }
  }
}
</script>
