import React, { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Breadcrumb,
  Form,
  Input,
  Modal,
  Button,
  message,
  Switch,
  InputNumber,
} from 'antd'
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

const DynamicTopic = () => {
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
      title: '专题名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '专题单词',
      dataIndex: 'en_name',
      key: 'en_name',
    },
    {
      title: '专题图标地址',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: '专题演示',
      dataIndex: 'icon',
      key: 'demo',
      render: (value: any, record: any) => {
        return (
          <div className="avatar img-preview">
            <img className="tag-img-icon" src={record.icon} alt="" />
          </div>
        )
      },
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '订阅数量',
      dataIndex: 'rss_count',
      key: 'rss_count',
    },
    {
      title: '是否首页侧栏显示',
      dataIndex: 'is_show',
      key: 'is_show',
      render: (value: any, record: any) => {
        return (
          <div className="table-is-login">
            {record.is_show ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
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
          <div className="table-is-login">
            {record.enable ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </div>
        )
      },
    },
    {
      title: '是否加入首页或者推荐',
      dataIndex: 'is_push',
      key: 'is_push',
      render: (value: any, record: any) => {
        return (
          <div className="table-is-login">
            {record.is_push ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
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
    setOperationId(val.topic_id)
    form.setFieldsValue({
      ...val,
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此文章吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.topic_id)
        /*删除文章*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const search = useCallback(() => {
    http
      .get('/dynamic-topic/list', {
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
        },
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination])

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
    /*创建动态专题*/
    http.post('/dynamic-topic/create', { ...values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('创建动态专题成功')
    })
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改动态专题*/
    http
      .post('/dynamic-topic/update', { topic_id: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改动态专题成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除动态专题*/
    http
      .post('/dynamic-topic/delete', { topic_id: values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('删除动态专题成功')
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
            <span>动态管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>动态专题</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-nav-btn">
        <button
          className="btn btn-danger"
          onClick={() => {
            showModal('add')
          }}
        >
          创建动态专题
        </button>
      </div>

      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title={isCreate ? '创建动态专题' : '修改动态专题'}
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
              label="专题名"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入专题名！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="专题名单词"
              name="en_name"
              rules={[
                {
                  required: true,
                  message: '请输入专题名单词！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="专题图标地址"
              name="icon"
              rules={[
                {
                  required: true,
                  message: '请输入专题图标地址！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="专题描述"
              name="description"
              rules={[
                {
                  required: true,
                  message: '请输入专题描述',
                  whitespace: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="首页显示"
              name="is_show"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: '请选择是否首页显示',
                },
              ]}
            >
              <Switch />
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

            <Form.Item
              label="是否加入首页或者推荐"
              name="is_push"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: '请选择是否加入首页或者推荐',
                },
              ]}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="sort"
              label="排序"
              rules={[
                {
                  required: true,
                  message: '请输入排序',
                },
              ]}
            >
              <InputNumber min={0} max={50} />
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
            rowKey={(record) => record.id}
          />
        </div>
      </div>
    </div>
  )
}

export default DynamicTopic
