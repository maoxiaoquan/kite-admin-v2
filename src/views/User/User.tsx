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
  InputNumber,
  DatePicker,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
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

const User = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [tableList, setTableList] = useState([])
  const [userRoleAll, setUserRoleAll] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [total, setTotal] = useState(0)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [operationId, setOperationId] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isBanVisible, setIsBanVisible] = useState(false)
  const [banDate, setBanDate] = useState('')
  const [form] = Form.useForm()

  useEffect(() => {
    http.get('/user-role/all').then((res) => {
      setUserRoleAll(res.data.list)
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
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '拥有的角色标签',
      dataIndex: 'user_role_ids',
      key: 'user_role_ids',
      render: (value: any, record: any) => {
        return (
          <div className="table-article-tag-view">
            {userRoleAll.map((item: any, key: any) => {
              let tags = record.user_role_ids
                ? record.user_role_ids.split(',')
                : []
              return tags.map((childItem: any, childKey: any) => {
                if (item.user_role_id === childItem) {
                  return (
                    <Tag
                      className="table-article-tag-list"
                      key={childKey}
                      color="purple"
                    >
                      {item.user_role_name}
                    </Tag>
                  )
                }
              })
            })}
          </div>
        )
      },
    },
    {
      title: '是否禁言中',
      dataIndex: 'ft_ban_dt',
      key: 'ft_ban_dt',
      render: (value: any, record: any) => {
        return (
          <div className="ban">
            <div>
              是否被禁：
              <Tag className="table-article-tag-list" color="orange">
                {isBan(record.ban_dt) ? 'yes' : 'no'}
              </Tag>
            </div>
            <div>
              禁言到：
              {record.ft_ban_dt}（{isBan(record.ban_dt) ? '禁言中' : '已过期'}）
            </div>
          </div>
        )
      },
    },
    {
      title: '是否可以登陆',
      dataIndex: 'enable',
      key: 'enable',
      render: (value: any, record: any) => {
        return (
          <div className="table-enable">
            {value ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </div>
        )
      },
    },
    {
      title: '贝壳余额',
      dataIndex: 'user_info',
      key: 'user_info',
      render: (value: any, record: any) => {
        return (
          <div className="table-enable">{record.user_info.shell_balance}</div>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => {
        return (
          <div className="operation-btn" style={{ width: '200px' }}>
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
              onClick={() => {
                setOperationId(record.uid)
                setIsBanVisible(true)
              }}
            >
              禁言
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
      user_role_ids: val.user_role_ids ? val.user_role_ids.split(',') : [],
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此用户吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.uid)
        /*删除用户*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const isBan = (data: any) => {
    let date = new Date()
    let currDate = date.setHours(date.getHours())
    if (new Date(currDate).getTime() > new Date(data).getTime()) {
      return false
    } else {
      return true
    }
  }

  const search = useCallback(() => {
    http
      .get('/user/list', {
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
      form.resetFields()
    } else {
      fetchEdit(values)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改用户标签*/
    http
      .post('/user/edit', { uid: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改用户标签成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除用户标签*/
    http.post('/user/delete', { uid: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除用户标签成功')
    })
  }

  const banUser = (val: any) => {
    http
      .post('/user/ban', {
        uid: operationId,
        ban_dt: banDate,
      })
      .then((res) => {
        setIsBanVisible(false)
        search()
      })
  }

  function onChange(value: any, dateString: any) {
    setBanDate(dateString)
  }

  return (
    <div className="layout-main">
      <div className="layout-main-title">
        <Breadcrumb>
          <Breadcrumb.Item href="#/manager/index">
            <span>主页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">
            <span>用户管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>用户汇总 </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title={isCreate ? '创建用户' : '修改用户'}
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
              name="user_role_ids"
              label="用户角色标签"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择用户角色标签"
                allowClear
              >
                {userRoleAll.map((item: any) => (
                  <Option key={item.user_role_id} value={item.user_role_id}>
                    {item.user_role_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="是否可登录"
              name="enable"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: '请选择是否可登录',
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

        <Modal
          onOk={() => {
            banUser({ type: 'article' })
          }}
          onCancel={() => {
            setIsBanVisible(false)
          }}
          title="禁言用户"
          visible={isBanVisible}
        >
          <div>
            <DatePicker
              onChange={onChange}
              format="YYYY-MM-DD HH:mm:ss"
              defaultValue={undefined}
            />
          </div>
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

export default User
