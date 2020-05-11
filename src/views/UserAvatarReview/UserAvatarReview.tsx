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
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import http from '@libs/http'

import { statusList, statusListText, articleTypeText } from '@utils/constant'
const Option = Select.Option
const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const UserAvatarReview = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [statusVal, setStatusVal] = useState('')
  const [sourceList] = useState(['', '原创', '转载'])
  const [statusTextList] = useState(['', '审核中', '审核通过', '审核失败'])
  const [tableList, setTableList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [total, setTotal] = useState(0)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [formData, setFormData] = useState({
    status: 0,
  })
  const [operationId, setOperationId] = useState('')
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
      title: '头像',
      dataIndex: 'title',
      key: 'title',
      render: (text: any, record: any) => (
        <div className="avatar-review">
          <img style={{ width: 80 + 'px' }} src={record.avatar_review} alt="" />
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'avatar_review_status',
      key: 'avatar_review_status',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="orange">
          {statusTextList[record.avatar_review_status]}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => {
        return record.avatar_review_status === 1 ||
          record.avatar_review_status === 3 ? (
          <div className="operation-btn">
            <Button
              onClick={() => {
                editData(record)
              }}
              size="small"
              type="primary"
            >
              修改
            </Button>
          </div>
        ) : (
          ''
        )
      },
    },
  ]

  const editData = (val: any) => {
    setIsVisibleEdit(true)
    setOperationId(val.uid)
    form.setFieldsValue({
      status: String(val.status),
      type: String(val.type),
      source: val.source,
      rejection_reason: val.rejection_reason,
      tag_ids: val.tag_ids ? val.tag_ids.split(',') : [],
    })
  }

  const search = useCallback(() => {
    http
      .get('/user/avatar-review-list', {
        params: {
          status: statusVal,
          page: pagination.current,
          pageSize: pagination.pageSize,
        },
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination, statusVal])

  useEffect(() => {
    http
      .get('/user/avatar-review-list', {
        params: {
          status: statusVal,
          page: pagination.current,
          pageSize: pagination.pageSize,
        },
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination, statusVal])

  const resetBarFrom = () => {
    setStatusVal('')
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination)
  }

  const onFinish = (values: any) => {
    fetchEdit(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改文章*/
    http
      .post('/user/avatar-review-set', { uid: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改文章成功')
      })
  }

  const onGenderChange = (value: any) => {
    setFormData({
      ...formData,
      status: value,
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
          <Breadcrumb.Item>用户头像汇总</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title="修改文章"
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
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select
                placeholder="请选择状态！"
                onChange={onGenderChange}
                allowClear
              >
                {statusTextList.map((item: any, key: any) => (
                  <Option value={key} key={key}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {formData.status == statusList.reviewFail ? (
              <Form.Item
                label="拒绝的原因"
                name="rejection_reason"
                rules={[
                  {
                    required: true,
                    message: '请输入拒绝的原因！',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : (
              ''
            )}

            <Form.Item name="type" label="类型" rules={[{ required: true }]}>
              <Select placeholder="请选择类型！" allowClear>
                {Object.keys(articleTypeText).map((key: any) => (
                  <Option key={key} value={key}>
                    {articleTypeText[key]}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
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
          <div className="xsb-operation-menu">
            <Form layout="inline">
              <Form.Item label="状态">
                <Select
                  className="select-view"
                  value={statusVal}
                  onChange={(value) => {
                    setStatusVal(value)
                  }}
                >
                  {statusTextList.map((item: any, key: any) =>
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

              <Form.Item>
                <button className="btn btn-danger" onClick={search}>
                  搜索
                </button>
                <button className="btn btn-primary" onClick={resetBarFrom}>
                  重置
                </button>
              </Form.Item>
            </Form>
          </div>

          <Table
            columns={columns}
            pagination={{ ...pagination, total }}
            onChange={handleTableChange}
            dataSource={tableList}
            rowKey={(record) => record.aid}
          />
        </div>
      </div>
    </div>
  )
}

export default UserAvatarReview
