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

import faceqq from '@utils/qq'
const Option = Select.Option
const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const BookComment = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [contentVal, setContentVal] = useState('')
  const [statusVal, setStatusVal] = useState('')
  const [tableList, setTableList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [total, setTotal] = useState(0)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [operationId, setOperationId] = useState('')
  const [form] = Form.useForm()

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
      title: '小书章节评论内容',
      dataIndex: 'content',
      key: 'content',
      render: (text: any, record: any) => (
        <div
          dangerouslySetInnerHTML={{
            __html: commentRender(record.content),
          }}
        />
      ),
    },
    {
      title: '来自小书',
      dataIndex: 'books',
      key: 'books',
      render: (text: any, record: any) => (
        <div>
          {record.books ? (
            <a href={`/book/${record.books_id}`} target="_block">
              {record.books.title ? record.books.title : '-'}
            </a>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      title: '来自小书章节',
      dataIndex: 'article',
      key: 'article',
      render: (text: any, record: any) => (
        <div>
          <a
            className="book-title"
            target="_blank"
            href={`/book/${record.books_id}/section/${record.book_id}`}
          >
            {record.book.title}
          </a>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="orange">
          {otherStatusListText[record.status]}
        </Tag>
      ),
    },
    {
      title: '评论时间',
      dataIndex: 'create_dt',
      key: 'create_dt',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => {
        return (
          <div className="operation-btn">
            <button
              onClick={() => {
                editDate(record)
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

  const editDate = (val: any) => {
    setIsVisibleEdit(true)
    setOperationId(val.id)
    form.setFieldsValue({
      status: String(val.status),
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此评论吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.id)
        /*删除小书*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const commentRender = (val: any) => {
    let newComment = val
    faceqq.map((faceItem: any) => {
      newComment = newComment.replace(
        new RegExp('\\' + faceItem.face_text, 'g'),
        faceItem.face_view
      )
    })
    return newComment
  }

  const search = useCallback(() => {
    http
      .post('/book-comment/list', {
        content: contentVal,
        status: statusVal,
        page: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [contentVal, pagination, statusVal])

  useEffect(() => {
    http
      .post('/book-comment/list', {
        page: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination])

  const resetBarFrom = () => {
    setContentVal('')
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
      .post('/book-comment/update', { id: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改小书章节评论成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除小书标签*/
    http.post('/book-comment/delete', { id: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除小书章节评论成功')
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
          <Breadcrumb.Item>评论管理</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title="审核评论"
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
              <Select placeholder="请选择状态！" allowClear>
                {Object.keys(otherStatusListText).map((key: any) => (
                  <Option key={key} value={key}>
                    {otherStatusListText[key]}
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
              <Form.Item label="评论内容">
                <Input
                  value={contentVal}
                  onChange={(e) => {
                    setContentVal(e.target.value)
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
                  {Object.keys(otherStatusListText).map((key: any) => (
                    <Option key={key} value={key}>
                      {otherStatusListText[key]}
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
            rowKey={(record) => record.id}
          />
        </div>
      </div>
    </div>
  )
}

export default BookComment
