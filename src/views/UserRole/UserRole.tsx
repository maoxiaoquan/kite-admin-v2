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
  Tree,
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
const TreeNode = Tree.TreeNode
interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const UserRole = () => {
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
  const [useRoleTypeList] = useState(['', '默认角色', '定制化角色'])
  const [visiblSeAuthorityModal, setVisiblSeAuthorityModal] = useState(false)
  const [roleAuthorityList, setRoleAuthorityList] = useState<string[]>([])
  const [userAuthoritySourceList, setUserAuthoritySourceList] = useState([])
  const [userAuthorityList, setUserAuthorityList] = useState<string[]>([])
  const [roleAuthorityListAll, setRoleAuthorityListAll] = useState<string[]>([])
  const [form] = Form.useForm()

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
    })
  }, [filterArray])

  useEffect(() => {
    fetchUserRoleList()
  }, [fetchUserRoleList])

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
      title: '角色名',
      dataIndex: 'user_role_name',
      key: 'user_role_name',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="orange">
          {record.user_role_name}
        </Tag>
      ),
    },
    {
      title: '角色图标',
      dataIndex: 'user_role_icon',
      key: 'user_role_icon',
    },
    {
      title: '角色类型',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="orange">
          {useRoleTypeList[record.user_role_type]}
        </Tag>
      ),
    },
    {
      title: '角色介绍',
      dataIndex: 'user_role_description',
      key: 'user_role_description',
    },
    {
      title: '角色图标演示',
      dataIndex: 'user_role_icon',
      key: 'user_role_icon_demo',
      render: (value: any, record: any) => {
        return (
          <div className="avatar img-preview">
            <img className="tag-img-icon" src={record.user_role_icon} alt="" />
          </div>
        )
      },
    },
    {
      title: '是否在个人中心显示',
      dataIndex: 'is_show',
      key: 'is_show',
      render: (value: any, record: any) => {
        return (
          <div className="table-enable">
            {value ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
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

            {record.user_role_type !== 2 ? (
              <button
                className="btn btn-primary"
                onClick={async () => {
                  setVisiblSeAuthorityModal(true)
                  initTreeData(
                    record.user_authority_ids
                      ? record.user_authority_ids.split(',')
                      : ''
                  )
                  setOperationId(record.user_role_id)
                }}
              >
                设置权限
              </button>
            ) : (
              ''
            )}
          </div>
        )
      },
    },
  ]

  const editData = (val: any) => {
    showModal('edit')
    setOperationId(val.user_role_id)
    form.setFieldsValue({
      ...val,
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此用户角色吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.user_role_id)
        /*删除用户角色*/
      },
      onCancel() {},
    })
  }

  const search = useCallback(() => {
    http
      .get('/user-role/list', {
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

  const initTreeData = (val: any) => {
    /* 初始化选中树 */
    let tree: Array<string> = []
    userAuthoritySourceList.map((item: any) => {
      if (
        Number(item.authority_type) === 2 &&
        val.indexOf(item.authority_id) !== -1
      ) {
        tree.push(item.authority_id)
      }
    })
    setRoleAuthorityList(tree)
    setRoleAuthorityListAll(tree)
  }

  const onFinishFailed = (errorInfo: any) => {}

  const fetchCreate = (values: editArticleInfo) => {
    /*创建用户角色*/
    http.post('/user-role/create', { ...values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('创建用户角色成功')
    })
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改用户角色*/
    http
      .post('/user-role/update', { user_role_id: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改用户角色成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除用户角色*/
    http
      .post('/user-role/delete', { user_role_id: values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('删除用户角色成功')
      })
  }

  const onCheck = (checkedKeys: any, event: any) => {
    setRoleAuthorityList(checkedKeys)
    const arr: any[] = [...checkedKeys, ...event.halfCheckedKeys]
    setRoleAuthorityListAll(arr)
  }

  const treeDataFormate = (data: any[]) =>
    data.map((item) => {
      item.key = item.authority_id
      item.title = item.authority_name
      if (item.children?.length) item.children = treeDataFormate(item.children)
      return item
    })

  const fetchSetUserRoleAuthority = () => {
    /* 传递tyepe=2子节点 */
    http
      .post('/user-role-authority/set', {
        user_role_id: operationId,
        roleAuthorityListAll,
      })
      .then(() => {
        message.success('角色权限设置成功')
        setVisiblSeAuthorityModal(false)
        fetchUserRoleList()
        search()
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
            <span>用户管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>用户角色</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-nav-btn">
        <button
          className="btn btn-danger"
          onClick={() => {
            showModal('add')
          }}
        >
          创建用户角色
        </button>
      </div>

      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title={isCreate ? '创建用户角色' : '修改用户角色'}
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
              label="角色名"
              name="user_role_name"
              rules={[
                {
                  required: true,
                  message: '请输入角色名！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="user_role_type"
              label="角色类型"
              rules={[{ required: true }]}
            >
              <Select placeholder="请选择角色类型" allowClear>
                {useRoleTypeList.map((item: any, key: any) =>
                  item ? (
                    <Option value={key} key={key}>
                      {item}
                    </Option>
                  ) : (
                    ''
                  )
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label="角色名图标"
              name="user_role_icon"
              rules={[
                {
                  required: true,
                  message: '请输入角色名图标！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="角色描述"
              name="user_role_description"
              rules={[
                {
                  required: true,
                  message: '请输入角色描述！',
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

            <Form.Item
              label="是否显示"
              name="is_show"
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
          footer={null}
          onCancel={() => {
            setVisiblSeAuthorityModal(false)
          }}
          title="设置权限"
          visible={visiblSeAuthorityModal}
        >
          <Tree
            checkable
            checkedKeys={roleAuthorityList}
            defaultExpandAll={true}
            onCheck={onCheck}
            showLine
            treeData={treeDataFormate(userAuthorityList)}
          ></Tree>
          <div className="admin-role-foot">
            <Button
              onClick={() => {
                fetchSetUserRoleAuthority()
              }}
              type="primary"
            >
              确定
            </Button>
            <Button
              onClick={() => {
                setVisiblSeAuthorityModal(false)
              }}
            >
              取消
            </Button>
          </div>
        </Modal>

        <div className="card-body">
          <Table
            columns={columns}
            pagination={{ ...pagination, total }}
            onChange={handleTableChange}
            dataSource={tableList}
            rowKey={(record) => record.user_role_id}
          />
        </div>
      </div>
    </div>
  )
}

export default UserRole
