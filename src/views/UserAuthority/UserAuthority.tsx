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

const UserAuthority = () => {
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
  const [userAuthorityList, setUserAuthorityList] = useState<string[]>([])
  const [userAuthoritySourceList, setUserAuthoritySourceList] = useState([])

  const filterArray = useCallback((result: any, pid: any) => {
    let _array: any[] = []
    for (let i in result) {
      if (result[i].authority_parent_id == pid) {
        result[i].children = filterArray(result, result[i].authority_id)
        _array.push(result[i])
      }
    }
    return _array
  }, [])

  const fetchUserRoleList = useCallback(() => {
    http.get('/user-authority/list').then((result: any) => {
      setUserAuthoritySourceList(result.data)
      const arr: any[] = filterArray(result.data, '')
      setUserAuthorityList(arr)
      console.log('userAuthorityList', userAuthorityList)
    })
  }, [filterArray, userAuthorityList])

  useEffect(() => {
    // fetchUserRoleList()
  }, [fetchUserRoleList])

  const editData = (val: any) => {
    showModal('edit')
    setOperationId(val.tag_id)
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
        fetchDelete(val.tag_id)
        /*删除文章*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const search = useCallback(() => {
    http
      .get('/user-authority/list', {
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
    } else {
      setIsCreate(false)
    }
  }

  const onFinish = (values: any) => {
    if (isCreate) {
      fetchCreate(values)
      form.resetFields()
    } else {
      fetchEdit(values)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const fetchCreate = (values: editArticleInfo) => {
    /*创建用户权限*/
    http.post('/user-authority/create', { ...values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('创建用户权限成功')
    })
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改用户权限*/
    http
      .post('/user-authority/update', { tag_id: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改用户权限成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除用户权限*/
    http.post('/user-authority/delete', { tag_id: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除用户权限成功')
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
            <span>文章管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>用户权限</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-nav-btn">
        <button
          className="btn btn-danger"
          onClick={() => {
            showModal('add')
          }}
        >
          创建标签
        </button>
      </div>

      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title={isCreate ? '创建标签' : '修改标签'}
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
              label="标签名"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入标签名！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="标签名单词"
              name="en_name"
              rules={[
                {
                  required: true,
                  message: '请输入标签单词！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="标签图标地址"
              name="icon"
              rules={[
                {
                  required: true,
                  message: '请输入标签图标！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="标签描述"
              name="description"
              rules={[
                {
                  required: true,
                  message: '请输入标签描述',
                  whitespace: true,
                },
              ]}
            >
              <Input.TextArea />
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
              label="文章是否加入首页或者推荐"
              name="is_push"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: '请选择文章是否加入首页或者推荐',
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

        </div>
      </div>
    </div>
  )
}

export default UserAuthority
