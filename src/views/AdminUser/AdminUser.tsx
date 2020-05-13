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
  Switch,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import http from '@libs/http'

const Option = Select.Option
const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const AdminUser = () => {
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
  const [isEditUserRole, setIsEditUserRole] = useState(false)
  const [roleId, setRoleId] = useState('')
  const [nickname, setNickname] = useState('')
  const [form] = Form.useForm()

  const [adminRoleAll, setAdminRoleAll] = useState([])
  useEffect(() => {
    http.get('/admin-role/all').then((res) => {
      setAdminRoleAll(res.data || [])
    })
  }, [])

  const currentUserRole = (value: any): any => {
    /*获取当前管理员用户的角色*/
    let currInfo = value
    let currRole = ''
    adminRoleAll.map((item: any) => {
      if (item.role_id === currInfo.admin_role_ids) {
        currRole = item
      }
    })
    return currRole
  }

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
      title: '账户',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '角色组',
      dataIndex: 'rule_name',
      key: 'rule_name',
      render: (text: any, record: any) => {
        return (
          <div className="operation-btn">
            {/* <Tag color="orange">超级管理员</Tag>*/}
            {currentUserRole(record) ? (
              <Tag color="orange">{currentUserRole(record).role_name}</Tag>
            ) : (
              <Tag color="#666">无</Tag>
            )}
          </div>
        )
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '是否可以登陆',
      dataIndex: 'enable',
      key: 'enable',
      render: (value: any, record: any) => {
        return (
          <div className="table-is-login">
            {value ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </div>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => {
        return (
          <div className="operation-btn" style={{ width: '250px' }}>
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
            <button
              className="btn btn-primary"
              onClick={async () => {
                setOperationId(record.uid)
                setNickname(record.nickname)
                setIsEditUserRole(true)
              }}
            >
              设置角色
            </button>
          </div>
        )
      },
    },
  ]

  const editData = (val: any) => {
    showModal('edit')
    setOperationId(val.uid)
    form.setFieldsValue({
      ...val,
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此管理员吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.uid)
        /*删除管理员*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const search = useCallback(() => {
    http
      .get('/admin-user/list', {
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
    /*创建管理员*/
    http.post('/admin-user/create', { ...values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('创建管理员成功')
    })
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改管理员*/
    http
      .post('/admin-user/edit', { uid: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改管理员成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除管理员*/
    http.post('/admin-user/delete', { uid: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除管理员成功')
    })
  }
  const setUserRole = () => {
    http
      .post('/admin-user-role/create', {
        /*创建管理员用户角色*/
        role_id: roleId,
        uid: operationId,
      })
      .then((res) => {
        search()
        setIsEditUserRole(false)
        message.success('创建管理员')
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
            <span>系统管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>管理员</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-nav-btn">
        <button
          className="btn btn-danger"
          onClick={() => {
            showModal('add')
          }}
        >
          创建管理员
        </button>
      </div>

      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title={isCreate ? '创建管理员' : '修改管理员'}
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
              label="账户"
              name="account"
              rules={[
                {
                  required: true,
                  message: '请输入账户！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="昵称"
              name="nickname"
              rules={[
                {
                  required: true,
                  message: '请输入昵称！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="重复密码"
              name="confirm"
              rules={[
                {
                  required: true,
                  message: '重复输入密码！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="电子邮件"
              name="email"
              rules={[
                {
                  type: 'email',
                  message: '输入的电子邮件无效！',
                },
                {
                  required: true,
                  message: '请输入您的电子邮件！',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="手机号码"
              name="phone"
              rules={[
                {
                  required: true,
                  message: '请输入你的手机号码！',
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
                  创建账户
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

        <Modal
          footer={null}
          onCancel={() => {
            setIsEditUserRole(false)
          }}
          title="修改用户权限"
          visible={isEditUserRole}
        >
          <Form.Item label="管理员账户">
            <Input disabled={true} type="text" value={nickname} />
          </Form.Item>
          <Form.Item label="角色类型">
            <Select
              placeholder="请设置权限"
              style={{ width: 150 }}
              onChange={(value: any) => {
                setRoleId(value)
              }}
            >
              {adminRoleAll.map((item: any) => (
                <Option key={item.role_id} value={item.role_id}>
                  {item.role_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              className="register-btn"
              type="primary"
              onClick={setUserRole}
            >
              修改用户角色
            </Button>
          </Form.Item>
        </Modal>

        <div className="card-body">
          <Table
            columns={columns}
            pagination={{ ...pagination, total }}
            onChange={handleTableChange}
            dataSource={tableList}
            rowKey={(record) => record.uid}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminUser
