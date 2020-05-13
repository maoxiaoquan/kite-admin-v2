import React, { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Breadcrumb,
  Form,
  Input,
  Modal,
  Button,
  message,
  Tree,
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import http from '@libs/http'

const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const AdminRole = () => {
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
    http.get('/admin-authority/list').then((result: any) => {
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
      title: '角色名字',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '角色描述',
      dataIndex: 'role_description',
      key: 'role_description',
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
                    record.admin_authority_ids
                      ? record.admin_authority_ids.split(',')
                      : ''
                  )
                  setOperationId(record.role_id)
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
    setOperationId(val.role_id)
    form.setFieldsValue({
      ...val,
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此管理员角色吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.role_id)
        /*删除管理员角色*/
      },
      onCancel() {},
    })
  }

  const search = useCallback(() => {
    http
      .get('/admin-role/list', {
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
    /*创建管理员角色*/
    http.post('/admin-role/create', { ...values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('创建管理员角色成功')
    })
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改管理员角色*/
    http
      .post('/admin-role/edit', { role_id: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改管理员角色成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除管理员角色*/
    http.post('/admin-role/delete', { role_id: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除管理员角色成功')
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
      .post('/admin-role-authority/set', {
        role_id: operationId,
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
            <span>系统管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>系统管理角色</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-nav-btn">
        <button
          className="btn btn-danger"
          onClick={() => {
            showModal('add')
          }}
        >
          创建管理员角色
        </button>
      </div>

      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title={isCreate ? '创建管理员角色' : '修改管理员角色'}
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
              name="role_name"
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
              label="角色描述"
              name="role_description"
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
            rowKey={(record) => record.role_id}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminRole
