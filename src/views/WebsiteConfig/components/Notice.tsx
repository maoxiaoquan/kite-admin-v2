import React, { useState, useEffect, useCallback } from 'react'
import { Table, Form, Input, Modal, Button, message, Switch } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import http from '@libs/http'

const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const Notice = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [tableList, setTableList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [total, setTotal] = useState(0)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [operationId, setOperationId] = useState('')
  const [isCreate, setIsCreate] = useState(true)
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
      title: '通知标题',
      dataIndex: 'title',
      key: 'title',
      render: (value: any, record: any) => {
        return (
          <div className="table-enable">
            {JSON.parse(record.option_value).title}
          </div>
        )
      },
    },
    {
      title: '通知链接',
      dataIndex: 'link',
      key: 'link',
      render: (value: any, record: any) => {
        return (
          <div className="table-enable">
            {JSON.parse(record.option_value).link}
          </div>
        )
      },
    },
    {
      title: '背景图片',
      dataIndex: 'img_url',
      key: 'img_url',
      render: (value: any, record: any) => {
        return (
          <div className="table-enable">
            {JSON.parse(record.option_value).img_url}
          </div>
        )
      },
    },
    {
      title: '是否可以用',
      dataIndex: 'enable',
      key: 'enable',
      render: (value: any, record: any) => {
        return (
          <div className="table-enable">
            {JSON.parse(record.option_value).enable ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )}
          </div>
        )
      },
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
    showModal('edit')
    setOperationId(val.option_id)
    form.setFieldsValue({
      ...JSON.parse(val.option_value),
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此文章吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.option_id)
        /*删除文章*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const search = useCallback(() => {
    http
      .get('/options/list', {
        params: {
          option_key: 'notice',
        },
      })
      .then((result: any) => {
        setTableList(result.data)
      })
  }, [])

  useEffect(() => {
    search()
  }, [search])

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination)
  }

  const showModal = (val: string) => {
    setIsVisibleEdit(true)
    if (val === 'add') {
      setIsCreate(true)
      form.resetFields()
    } else {
      setIsCreate(false)
    }
  }

  const onFinish = (values: any) => {
    if (isCreate) {
      fetchCreate(values)
    } else {
      fetchEdit(values)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const fetchCreate = (values: editArticleInfo) => {
    /*创建公告*/
    http
      .post('/options/create', {
        option_key: 'notice',
        option_value: JSON.stringify(values),
      })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('创建公告成功')
      })
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改公告*/
    http
      .post('/options/update', {
        option_id: operationId,
        option_key: 'notice',
        option_value: JSON.stringify(values),
      })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改公告成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除公告*/
    http.post('/options/delete', { option_id: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除公告成功')
    })
  }

  return (
    <div className="layout-main">
      <div className="layout-nav-btn">
        <button
          className="btn btn-danger"
          onClick={() => {
            showModal('add')
          }}
        >
          创建通知公告
        </button>
      </div>

      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title={isCreate ? '创建公告' : '修改公告'}
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
            <Form.Item
              label="公告标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: '请输入公告标题！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="公告链接"
              name="link"
              rules={[
                {
                  required: true,
                  message: '请输入公告链接！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="背景图片"
              name="img_url"
              rules={[
                {
                  required: true,
                  message: '请输入背景图片链接',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="是否有效"
              name="enable"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: '请选择是否有效',
                },
              ]}
            >
              <Switch />
            </Form.Item>

            <Form.Item {...tailLayout}>
              {isCreate ? (
                <Button type="primary" htmlType="submit">
                  创建
                </Button>
              ) : (
                <Button type="primary" htmlType="submit">
                  修改
                </Button>
              )}

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
          <Table
            columns={columns}
            pagination={{ ...pagination, total }}
            onChange={handleTableChange}
            dataSource={tableList}
            rowKey={(record) => record.option_id}
          />
        </div>
      </div>
    </div>
  )
}

export default Notice
