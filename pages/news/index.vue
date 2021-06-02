<template>
  <div>
    <a-button type="primary" @click="onEditCreate()"> Create new </a-button>
    <a-table
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="opration" slot-scope="record">
        <a-space :size="4">
          <a-button type="link" @click="onDetail(record)"
            ><a-icon type="eye" />Detail</a-button
          >
          <a-button type="link" @click="onEditCreate(record)"
            ><a-icon type="edit" />Edit</a-button
          >
          <a-popconfirm
            placement="rightTop"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirm(record)"
          >
            <template slot="title">
              <p>Do you Want to delete these items</p>
            </template>
            <a-button type="link"><a-icon type="delete" />Delete</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <!-- <div v-if="dataDetail">
      <div class="modal-detail">
        <a-modal v-model="visibleDetail" title="Basic Modal" @ok="handleOk">
          <p>ID: {{ dataDetail.id }}</p>
          <p>Title: {{ dataDetail.title }}</p>
          <p>Content: {{ dataDetail.content }}</p>
        </a-modal>
      </div>
    </div> -->
    <news-detail-modal :data_detail="dataDetail" ref="detailModal" />
    <div class="edit">
      <a-modal
        v-model="visibleEdit"
        title="Create update data"
        cancel-text="Cancel"
        ok-text="Save"
        @ok="handleSubmit"
      >
        <a-form ref="form" :form="form" :rules="rules">
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="Title"
          >
            <a-input
              v-decorator="[
                'title',
                {
                  rules: [
                    { required: true, message: 'Please input your title !' },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="Content"
          >
            <a-input
              v-decorator="[
                'content',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your content !',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="Description"
          >
            <a-input
              v-decorator="[
                'shortDescription',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your description !',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="Category"
          >
            <a-input
              v-decorator="[
                'categoryCode',
                {
                  rules: [
                    {
                      required: false,
                      message: 'Please input your category !',
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

const queryData = (params) => {
  return axios.get('https://e3074465f385.ngrok.io/new', { params })
}
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    sorter: true,
    width: '20%'
  },
  {
    title: 'Title',
    dataIndex: 'title',
    width: '20%'
  },
  {
    title: 'Content',
    dataIndex: 'content'
  },
  {
    title: 'Operation',
    dataIndex: 'id',
    scopedSlots: { customRender: 'opration' }
  }
]

export default {
  data () {
    return {
      data: [],
      pagination: {
        defaultPageSize: 6,
        showSizeChanger: false
      },
      loading: false,
      columns,
      visibleDetail: false,
      visibleEdit: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      dataDetail: null,
      isCreate: false
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    handleTableChange (pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        limit: pager.defaultPageSize,
        page: pagination.current
      })
    },
    fetch (params = {}) {
      this.loading = true
      queryData({
        page: 1,
        limit: this.pagination.defaultPageSize,
        ...params
      }).then(({ data }) => {
        const pagination = { ...this.pagination }
        pagination.total = data.totalItem
        this.loading = false
        this.data = data.listResult
        this.pagination = pagination
      })
    },
    async onDetail (id) {
      const info = await axios.get(`https://e3074465f385.ngrok.io/new/${id}`)
      this.dataDetail = info.data
      this.$refs.detailModal.show()
      // this.visibleDetail = true
    },
    handleOk () {
      this.visibleDetail = false
    },
    confirm (id) {
      axios
        .delete('https://e3074465f385.ngrok.io/new', {
          data: [id]
        })
        .then((data) => {
          if (data) {
            this.fetch()
          }
        })
    },
    async onEditCreate (id) {
      if (id) {
        const info = await axios.get(`https://e3074465f385.ngrok.io/new/${id}`)
        this.dataDetail = info.data
        this.form.getFieldDecorator('title', { initialValue: info.data.title })
        this.form.getFieldDecorator('content', {
          initialValue: info.data.content
        })
        this.form.getFieldDecorator('shortDescription', {
          initialValue: info.data.shortDescription
        })
        this.form.getFieldDecorator('categoryCode', {
          initialValue: info.data.categoryCode
        })
      } else {
        this.isCreate = true
        this.form.getFieldDecorator('title', { initialValue: '' })
        this.form.getFieldDecorator('content', {
          initialValue: ''
        })
        this.form.getFieldDecorator('shortDescription', {
          initialValue: ''
        })
        this.form.getFieldDecorator('categoryCode', {
          initialValue: ''
        })
      }
      this.visibleEdit = true
    },
    handleSubmit () {
      const {
        form: { validateFields }
      } = this
      validateFields((err, values) => {
        if (!err) {
          const data = {
            title: values.title,
            content: values.content,
            shortDescription: values.shortDescription,
            categoryCode: values.categoryCode,
            thumnail: ''
          }
          if (!this.isCreate) {
            axios
              .put(
                `https://e3074465f385.ngrok.io/new/${this.dataDetail.id}`,
                data
              )
              .then((data) => {
                if (data) {
                  this.visibleEdit = false
                  this.fetch()
                }
              })
          } else {
            axios
              .post('https://e3074465f385.ngrok.io/new', data)
              .then((data) => {
                if (data) {
                  this.visibleEdit = false
                  this.fetch()
                  this.isCreate = false
                }
              })
          }
        }
      })
    }
  }
}
</script>
