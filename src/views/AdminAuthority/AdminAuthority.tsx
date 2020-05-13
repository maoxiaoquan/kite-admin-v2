import React, { useState, useEffect, useCallback } from 'react'
import {
  Breadcrumb,
  Form,
  Select,
  Input,
  Modal,
  Tree,
  Button,
  message,
  Switch,
  InputNumber,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons'
import http from '@libs/http'
import './AdminAuthority.scss'

const Option = Select.Option
const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const AdminAuthority = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [operationId, setOperationId] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [form] = Form.useForm()
  const [userAuthorityList, setUserAuthorityList] = useState<string[]>([])
  const [authorityParent, setAuthorityParent] = useState({
    authority_parent_id: '',
    authority_parent_name: '',
  })
  const [authorityType, setAuthorityType] = useState(0)

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
    http.get('/admin-authority/list').then((result: any) => {
      const arr: any[] = filterArray(result.data, '')
      setUserAuthorityList(arr)
    })
  }, [filterArray])

  useEffect(() => {
    fetchUserRoleList()
  }, [fetchUserRoleList])

  const editData = (val: any) => {
    showModal('edit', val)
    setOperationId(val.authority_id)
    form.setFieldsValue({
      ...val,
    })
    setAuthorityType(val.authority_type)
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此文章吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val)
        /*删除文章*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const showModal = (val: string, data: any) => {
    setIsVisibleEdit(true)
    if (val === 'add') {
      form.resetFields()
      setAuthorityParent({
        authority_parent_id: data.authority_id || '',
        authority_parent_name: data.authority_name || '',
      })
      setIsCreate(true)
    } else {
      setAuthorityParent({
        authority_parent_id: data.authority_parent_id || '',
        authority_parent_name: data.authority_parent_name || '',
      })
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
    /*创建管理员权限*/
    http
      .post('/admin-authority/create', { ...values, ...authorityParent })
      .then((result: any) => {
        fetchUserRoleList()
        setIsVisibleEdit(false)
        message.success('创建管理员权限成功')
      })
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改管理员权限*/
    http
      .post('/admin-authority/update', { authority_id: operationId, ...values })
      .then((result: any) => {
        fetchUserRoleList()
        setIsVisibleEdit(false)
        message.success('修改管理员权限成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除管理员权限*/
    let id_arr = traversalDelete(values)
    http
      .post('/admin-authority/delete', { authority_id_arr: id_arr })
      .then((result: any) => {
        fetchUserRoleList()
        setIsVisibleEdit(false)
        message.success('删除管理员权限成功')
      })
  }

  const isEmpty = (obj: any) => {
    var key
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }

  const traversalDelete = (val: any) => {
    let _arr = []

    function id_arr(data: any) {
      for (let i in data) {
        _arr.push(data[i].authority_id)
        if (!isEmpty(data[i].children)) {
          id_arr(data[i].children)
        }
      }
    }

    _arr.push(val.authority_id)
    if (!isEmpty(val.children)) {
      id_arr(val.children)
    }
    return _arr
  }

  const customLabel = (data: any) => {
    return (
      <div className="box-tree-title clearfix">
        <div className="pull-left">
          <span className="title">{data.authority_name} </span>
        </div>
        <div className="pull-right">
          <Button
            size={'small'}
            onClick={() => {
              showModal('add', data)
            }}
          >
            <PlusSquareOutlined />
          </Button>
          <Button
            size={'small'}
            onClick={() => {
              editData(data)
            }}
          >
            <EditOutlined />
          </Button>
          <Button size={'small'} onClick={() => deleteData(data)}>
            <DeleteOutlined />
          </Button>
        </div>
      </div>
    )
  }

  const treeDataFormate = (data: any[]) =>
    data.map((item) => {
      item.key = item.authority_id
      item.title = customLabel(item)
      if (item.children?.length) item.children = treeDataFormate(item.children)
      return item
    })

  const authorityTypeChange = (val: any) => {
    setAuthorityType(val)
  }

  return (
    <div className="layout-main admin-authority">
      <div className="layout-main-title">
        <Breadcrumb>
          <Breadcrumb.Item href="#/manager/index">
            <span>主页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">
            <span>系统管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>管理员权限</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-nav-btn">
        <button
          className="btn btn-danger"
          onClick={() => {
            showModal('add', {})
          }}
        >
          创建管理员权限
        </button>
      </div>

      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title={isCreate ? '创建管理员权限' : '修改管理员权限'}
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
            {authorityParent.authority_parent_name ? (
              <Form.Item label="父权限名称">
                <Input disabled value={authorityParent.authority_parent_name} />
              </Form.Item>
            ) : (
              ''
            )}

            <Form.Item
              label="权限名称"
              name="authority_name"
              rules={[
                {
                  required: true,
                  message: '请输入权限名称！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="权限类型"
              name="authority_type"
              rules={[
                {
                  required: true,
                  message: '请选择权限类型！',
                  whitespace: true,
                },
              ]}
            >
              <Select onChange={authorityTypeChange}>
                <Option value="1">基础菜单</Option>
                <Option value="2">操作和功能</Option>
              </Select>
            </Form.Item>

            {authorityType == 2 ? (
              <Form.Item
                label="权限路径"
                name="authority_url"
                rules={[
                  {
                    required: true,
                    message: '请输入权限路径！',
                    whitespace: true,
                  },
                ]}
              >
                <Input
                  addonBefore="/api-client/v1"
                  placeholder="请输入权限路径"
                />
              </Form.Item>
            ) : (
              <Form.Item
                label="权限Key"
                name="authority_url"
                rules={[
                  {
                    required: true,
                    message: '请输入权限Key',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            )}

            <Form.Item
              name="authority_sort"
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

            <Form.Item
              label="权限描述"
              name="authority_description"
              rules={[
                {
                  required: true,
                  message: '请输入权限描述',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            {authorityType == 2 ? (
              <Form.Item
                label="是否显示"
                name="enable"
                valuePropName="checked"
                rules={[
                  {
                    required: true,
                    message: '请选择是否显示',
                  },
                ]}
              >
                <Switch />
              </Form.Item>
            ) : (
              ''
            )}

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
          <Tree
            defaultExpandAll={true}
            showLine
            treeData={treeDataFormate(userAuthorityList)}
          ></Tree>
        </div>
      </div>
    </div>
  )
}

export default AdminAuthority
