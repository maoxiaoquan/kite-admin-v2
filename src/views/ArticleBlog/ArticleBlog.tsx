import React, { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Breadcrumb, Form, Select, Input, Modal, Button, message } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import http from '@libs/http'

import {
  statusList,
  statusListText,
  articleTypeText,
  otherStatusListText
} from '@utils/constant'
const Option = Select.Option
const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const ArticleBlog = () => {

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const [nameVal, setNameVal] = useState('')
  const [statusVal, setStatusVal] = useState('')
  const [tableList, setTableList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [total, setTotal] = useState(0)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [formData, setFormData] = useState({
    status: 0
  })
  const [operationId, setOperationId] = useState('')
  const [form] = Form.useForm();


  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text: any, record: any, index: any) => (
        <span
          style={{
            width: '20px',
            display: 'block'
          }}
        >
          {(pagination.current - 1) * 10 + index + 1}
        </span>
      )
    },
    {
      title: '专栏名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '专栏英文名字',
      dataIndex: 'en_name',
      key: 'en_name'
    },
    {
      title: '专栏图标演示',
      dataIndex: 'icon',
      key: 'icon',
      render: (text: any, record: any) => (
        <div className="avatar img-preview">
          {record.icon ? <img src={record.icon} alt="" /> : ''}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="red">
          {otherStatusListText[record.status]}
        </Tag>
      )
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '审核被拒绝的原因',
      dataIndex: 'rejection_reason',
      key: 'rejection_reason'
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
          </div>
        )
      }
    }
  ];


  const editDate = (val: any) => {
    setIsVisibleEdit(true)
    setOperationId(val.blog_id)
    form.setFieldsValue({
      status: String(val.status),
      name: String(val.name),
      rejection_reason: val.rejection_reason,
    });
  }


  const search = useCallback(() => {
    http.get('/article-blog/list', {
      params: {
        name: nameVal,
        status: statusVal,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }
    })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [nameVal, pagination, statusVal])

  useEffect(() => {
    http.get('/article-blog/list', {
      params: {
        page: pagination.current,
        pageSize: pagination.pageSize,
      }
    })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination])

  const resetBarFrom = () => {
    setNameVal('')
    setStatusVal('')
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination)
  };


  const onFinish = (values: any) => {
    fetchEdit(values)
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const fetchEdit = (values: editArticleInfo) => {
    /*修改文章*/
    http.post('/article-blog/update', { blog_id: operationId, ...values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('修改文章个人专栏成功');
    })
  }

  const onGenderChange = (value: any) => {
    setFormData({
      ...formData,
      status: value
    })
  };

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
          <Breadcrumb.Item>个人专栏</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card">

        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title="编辑个人专栏"
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

            <Form.Item label="个人专栏名" name="name">
              <Input disabled />
            </Form.Item>

            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select
                placeholder="请选择状态！"
                onChange={onGenderChange}
                allowClear
              >
                {Object.keys(statusListText).map((key: any) => (
                  <Option key={key} value={key}>
                    {statusListText[key]}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {formData.status == statusList.reviewFail ? (<Form.Item
              label="拒绝的原因"
              name="rejection_reason"
              rules={[{
                required: true,
                message: '请输入拒绝的原因！',
                whitespace: true
              }]}
            >
              <Input />
            </Form.Item>) : ''}


            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => {
                setIsVisibleEdit(false)
              }}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <div className="card-body">

          <div className="xsb-operation-menu">
            <Form layout="inline">
              <Form.Item label="个人专题标题">
                <Input
                  value={nameVal}
                  onChange={e => {
                    setNameVal(e.target.value)
                  }}
                />
              </Form.Item>

              <Form.Item label="状态">
                <Select
                  className="select-view"
                  value={statusVal}
                  onChange={value => {
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
                <button
                  className="btn btn-danger"
                  onClick={search}
                >
                  搜索
                  </button>
                <button
                  className="btn btn-primary"
                  onClick={resetBarFrom}
                >
                  重置
                  </button>
              </Form.Item>
            </Form>
          </div>

          <Table columns={columns} pagination={{ ...pagination, total }} onChange={handleTableChange} dataSource={tableList} rowKey={record => record.blog_id} />
        </div>
      </div>
    </div>
  )

}

export default ArticleBlog
