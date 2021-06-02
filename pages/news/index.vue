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
            @confirm="confirmDelete(record)"
          >
            <template slot="title">
              <p>Do you Want to delete these items</p>
            </template>
            <a-button type="link"><a-icon type="delete" />Delete</a-button>
          </a-popconfirm>
        </a-space>
        <news-detail-modal :data_detail="record" ref="detailModal" />
      </template>
    </a-table>
    <!-- Detail modal -->
    <news-detail-modal ref="detailModal" />
    <!-- Update create modal -> update next time -->
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
import {
  createNew,
  deleteNew,
  getNewDetail,
  getNews,
  updateNew
} from '../../service/news'

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
      isCreate: false,
      currentId: 0
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
    async fetch (params) {
      this.loading = true
      let page = 1
      let limit = this.pagination.defaultPageSize
      if (params) {
        page = params.page
        limit = params.limit
      }
      const info = await getNews(page, limit)
      const pagination = { ...this.pagination }
      pagination.total = info.totalItem
      this.loading = false
      this.data = info.listResult
      this.pagination = pagination
    },
    async onDetail (id) {
      this.$refs.detailModal.show(id)
    },
    async confirmDelete (id) {
      await deleteNew([id])
      this.$message.success('Delete successfully', 5)
      this.fetch()
    },
    async onEditCreate (id) {
      this.currentId = id
      if (id) {
        const info = await getNewDetail(id)
        console.log(info)
        this.dataDetail = info
        this.form.getFieldDecorator('title', { initialValue: info.title })
        this.form.getFieldDecorator('content', {
          initialValue: info.content
        })
        this.form.getFieldDecorator('shortDescription', {
          initialValue: info.shortDescription
        })
        this.form.getFieldDecorator('categoryCode', {
          initialValue: info.categoryCode
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
      validateFields(async (err, values) => {
        if (!err) {
          const data = {
            title: values.title,
            content: values.content,
            shortDescription: values.shortDescription,
            categoryCode: values.categoryCode,
            thumnail: ''
          }
          if (!this.isCreate) {
            const resData = await updateNew(this.currentId, data)
            if (resData) {
              this.visibleEdit = false
              this.pagination.current = 1
              this.fetch()
              this.$message.success('Data update successfully', 5)
            }
          } else {
            const resData = await createNew(data)
            if (resData) {
              this.visibleEdit = false
              this.pagination.current = 1
              this.fetch()
              this.$message.success('New created successfully', 5)
            }
          }
        }
      })
    }
  }
}
</script>
