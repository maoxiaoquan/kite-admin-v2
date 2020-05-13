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

import { statusList, statusListText } from '@utils/constant'
const Option = Select.Option
const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const Books = () => {
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
      title: '小书标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: any, record: any) => (
        <a
          className="article-title"
          target="_blank"
          href={`/book/${record.books_id}`}
        >
          {record.title}
        </a>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'create_dt',
      key: 'create_dt',
    },
    {
      title: '小书封面演示',
      dataIndex: 'cover_img',
      key: 'cover_img',
      render: (text: any, record: any) => (
        <div className="avatar img-preview">
          {record.cover_img ? <img src={record.cover_img} alt="" /> : ''}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="orange">
          {statusListText[record.status]}
        </Tag>
      ),
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
      key: 'read_count',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="green">
          {record.read_count}
        </Tag>
      ),
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      key: 'comment_count',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="green">
          {record.comment_count}
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
    setOperationId(val.books_id)
    form.setFieldsValue({
      status: String(val.status),
      type: String(val.type),
      rejection_reason: val.rejection_reason,
      tag_ids: val.tag_ids ? val.tag_ids.split(',') : [],
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此小书吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.books_id)
        /*删除小书*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const search = useCallback(() => {
    http
      .post('/books/list', {
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
      .post('/books/list', {
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
    /*修改小书*/
    http
      .post('/books/update', { books_id: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改小书成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*修改小书*/
    http.post('/books/delete', { books_id: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除小书成功')
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
            <span>小书管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>小书汇总</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title="修改小书"
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

            <Form.Item
              name="tag_ids"
              label="所属标签"
              rules={[{ required: true }]}
            >
              <Select placeholder="请选择所属标签" allowClear mode="multiple">
                {articleTagAll.map((item: any) => (
                  <Option key={item.tag_id} value={item.tag_id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

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
              <Form.Item label="小书标题">
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

export default Books
