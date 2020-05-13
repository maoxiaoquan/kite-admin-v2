import React, { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Breadcrumb, Form, Modal, message } from 'antd'

import http from '@libs/http'

const confirm = Modal.confirm

const AdminSystemLog = () => {
  const [tableList, setTableList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [total, setTotal] = useState(0)

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
      title: '操作时间',
      dataIndex: 'create_dt',
      key: 'create_dt',
    },
    {
      title: '管理员',
      dataIndex: 'admin_user',
      key: 'admin_user',
      render: (text: any, record: any) => {
        return record.admin_user.nickname
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="orange">
          {['', '创建', '修改', '删除', '登录'][record.type]}
        </Tag>
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => {
        return (
          <div className="operation-btn">
            <button
              className="btn btn-light"
              onClick={() => {
                deleteData(record)
              }}
            >
              删除
            </button>
          </div>
        )
      },
    },
  ]

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此文章吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.id)
        /*删除文章*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const search = useCallback(() => {
    http
      .get('/admin-system-log/list', {
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
    if (val === 'add') {
      form.resetFields()
    } else {
    }
  }

  const fetchDelete = (values: String) => {
    /*删除后台日志*/
    http
      .post('/admin-system-log/delete', { id: values })
      .then((result: any) => {
        search()
        message.success('删除后台日志成功')
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
          <Breadcrumb.Item>后台日志</Breadcrumb.Item>
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

export default AdminSystemLog
