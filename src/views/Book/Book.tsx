import React, { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Tag,
  Breadcrumb,
  Form,
  Select,
  Input,
  Modal,
  Button,
  message,
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import http from '@libs/http'

import {
  statusList,
  statusListText,
  articleTypeText,
  otherStatusListText,
} from '@utils/constant'
const Option = Select.Option
const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const Book = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [titleVal, setTitleVal] = useState('')
  const [statusVal, setStatusVal] = useState('')
  const [tableList, setTableList] = useState([])
  const [articleTagAll, setArticleTagAll] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [total, setTotal] = useState(0)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [formData, setFormData] = useState({
    status: 0,
  })
  const [operationId, setOperationId] = useState('')
  const [form] = Form.useForm()

  useEffect(() => {
    http.get('/article-tag/all').then((res) => {
      setArticleTagAll(res.data.list)
    })
  }, [])

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text: any, record: any, index: any) => (
        <span
          style={{
            width: '20px',
            display: 'block',
          }}
        >
          {(pagination.current - 1) * 10 + index + 1}
        </span>
      ),
    },
    {
      title: '所属小书',
      dataIndex: 'books_id',
      key: 'books_id',
      render: (text: any, record: any) => (
        <a
          className="book-title"
          target="_blank"
          href={`/book/${record.books_id}`}
        >
          {record.books ? record.books.title : '-'}
        </a>
      ),
    },
    {
      title: '小书章节标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: any, record: any) => (
        <a
          className="book-title"
          target="_blank"
          href={`/book/${record.books_id}/section/${record.book_id}`}
        >
          {record.title}
        </a>
      ),
    },
    {
      title: '概要',
      dataIndex: 'excerpt',
      key: 'excerpt',
    },
    {
      title: '创建时间',
      dataIndex: 'create_dt',
      key: 'create_dt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <Tag className="table-book-tag-list" color="orange">
          {otherStatusListText[record.status]}
        </Tag>
      ),
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
      key: 'read_count',
      render: (text: any, record: any) => (
        <Tag className="table-book-tag-list" color="green">
          {record.read_count || 0}
        </Tag>
      ),
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      key: 'comment_count',
      render: (text: any, record: any) => (
        <Tag className="table-book-tag-list" color="green">
          {record.commentCount}
        </Tag>
      ),
    },
    {
      title: '拒绝的原因',
      dataIndex: 'rejection_reason',
      key: 'rejection_reason',
      render: (text: any, record: any) => (
        <div>
          {record.status == statusList.reviewFail
            ? record.rejection_reason
            : ''}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => {
        return (
          <div className="operation-btn">
            <button
              onClick={() => {
                editData(record)
              }}
              className="btn btn-info"
            >
              <EditOutlined />
            </button>
            <button
              className="btn btn-light"
              onClick={() => {
                deleteData(record)
              }}
            >
              <DeleteOutlined />
            </button>
          </div>
        )
      },
    },
  ]

  const editData = (val: any) => {
    setIsVisibleEdit(true)
    setOperationId(val.book_id)
    form.setFieldsValue({
      status: String(val.status),
      type: String(val.type),
      rejection_reason: val.rejection_reason,
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此小书章节吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.book_id)
        /*删除小书章节*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const search = useCallback(() => {
    http
      .post('/book/list', {
        title: titleVal,
        status: statusVal,
        page: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination, statusVal, titleVal])

  useEffect(() => {
    http
      .post('/book/list', {
        status: statusVal,
        page: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination, statusVal])

  const resetBarFrom = () => {
    setTitleVal('')
    setStatusVal('')
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination)
  }

  const onFinish = (values: any) => {
    fetchEdit(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改小书章节*/
    http
      .post('/book/update', { book_id: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改小书章节成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*修改小书章节*/
    http.post('/book/delete', { book_id: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除小书章节成功')
    })
  }

  const onGenderChange = (value: any) => {
    setFormData({
      ...formData,
      status: value,
    })
  }

  return (
    <div className="layout-main">
      <div className="layout-main-title">
        <Breadcrumb>
          <Breadcrumb.Item href="#/manager/index">
            <span>主页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">
            <span>小书章节管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>小书章节汇总</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title="修改小书章节"
          visible={isVisibleEdit}
        >
          <Form
            {...layout}
            name="basic"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select
                placeholder="请选择状态！"
                onChange={onGenderChange}
                allowClear
              >
                {Object.keys(statusListText).map((key: any) => (
                  <Option key={key} value={key}>
                    {statusListText[key]}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {formData.status == statusList.reviewFail ? (
              <Form.Item
                label="拒绝的原因"
                name="rejection_reason"
                rules={[
                  {
                    required: true,
                    message: '请输入拒绝的原因！',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : (
              ''
            )}

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button
                onClick={() => {
                  setIsVisibleEdit(false)
                }}
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <div className="card-body">
          <div className="xsb-operation-menu">
            <Form layout="inline">
              <Form.Item label="小书章节标题">
                <Input
                  value={titleVal}
                  onChange={(e) => {
                    setTitleVal(e.target.value)
                  }}
                />
              </Form.Item>

              <Form.Item label="状态">
                <Select
                  className="select-view"
                  value={statusVal}
                  onChange={(value) => {
                    setStatusVal(value)
                  }}
                >
                  <Option value="">全部</Option>
                  {Object.keys(statusListText).map((key: any) => (
                    <Option key={key} value={key}>
                      {statusListText[key]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <button className="btn btn-danger" onClick={search}>
                  搜索
                </button>
                <button className="btn btn-primary" onClick={resetBarFrom}>
                  重置
                </button>
              </Form.Item>
            </Form>
          </div>

          <Table
            columns={columns}
            pagination={{ ...pagination, total }}
            onChange={handleTableChange}
            dataSource={tableList}
            rowKey={(record) => record.aid}
          />
        </div>
      </div>
    </div>
  )
}

export default Book
