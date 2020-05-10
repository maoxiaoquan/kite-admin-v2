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

import {
  statusList,
  statusListText,
  articleTypeText,
  otherStatusList,
  otherStatusListText,
  dynamicTypeText,
  dynamicType,
} from '@utils/constant'
const Option = Select.Option
const confirm = Modal.confirm

interface editArticleInfo {
  source: number | String
  status: String
  tag_ids: String[]
  type: String
}

const Dynamic = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [contentVal, setContentVal] = useState('')
  const [statusVal, setStatusVal] = useState('')
  const [typeVal, setTypeVal] = useState('')
  const [tableList, setTableList] = useState([])
  const [dynamicTopicAll, setDynamicTopicAll] = useState([])
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

  useEffect(() => {
    http.get('/dynamic-topic/all').then((res) => {
      setDynamicTopicAll(res.data.all)
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
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (text: any, record: any) => (
        <a href={`/dynamic/${record.id}`} className="dynamic-content">
          {record.content}
        </a>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'create_dt',
      key: 'create_dt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="red">
          {otherStatusListText[record.status]}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="red">
          {dynamicTypeText[record.type]}
        </Tag>
      ),
    },
    {
      title: '所属话题',
      dataIndex: 'tag_ids',
      key: 'tag_ids',
      render: (value: any, record: any) => {
        return (
          <div className="table-article-tag-view">
            {dynamicTopicAll.map((item: any, key: any) => {
              if (item.topic_id === record.topic_ids) {
                return (
                  <Tag
                    className="table-article-tag-list"
                    key={key}
                    color="orange"
                  >
                    {item.name}
                  </Tag>
                )
              }
            })}
          </div>
        )
      },
    },
    {
      title: '预览',
      dataIndex: 'attach',
      key: 'attach',
      render: (text: any, record: any) => (
        <div
          className="img-preview"
          dangerouslySetInnerHTML={{
            __html: renderAttach(record) || '',
          }}
        />
      ),
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      key: 'comment_count',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="green">
          {record.comment_count}
        </Tag>
      ),
    },
    {
      title: '拒绝的原因',
      dataIndex: 'rejection_reason',
      key: 'rejection_reason',
      render: (text: any, record: any) => (
        <div>
          {record.status == otherStatusList.reviewFail
            ? record.rejection_reason
            : ''}
        </div>
      ),
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
    setIsVisibleEdit(true)
    setOperationId(val.id)
    form.setFieldsValue({
      status: String(val.status),
      type: String(val.type),
      rejection_reason: val.rejection_reason,
      topic_ids: val.topic_ids,
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此动态吗？',
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
      .post('/dynamic/list', {
        content: contentVal,
        status: statusVal,
        type: typeVal,
        page: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [contentVal, pagination, statusVal, typeVal])

  useEffect(() => {
    http
      .post('/dynamic/list', {
        status: statusVal,
        type: typeVal,
        page: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination, statusVal, typeVal])

  const resetBarFrom = () => {
    setContentVal('')
    setStatusVal('')
    setTypeVal('')
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

  const imgAnalyze = (attach: string) => {
    let urlArr = attach.split(',') || []
    let length = attach.split(',').length
    return length > 0 ? urlArr : []
  }

  const renderAttach = (item: any) => {
    // 渲染其他
    if (item.type === dynamicType.link) {
      return `<a href="${item.attach}" target="_block">
       ${item.attach}
        </a>`
    } else if (item.type === dynamicType.img) {
      let img = ''
      imgAnalyze(item.attach).map((item: any) => {
        img += `<img src="${item}" alt=""></img>`
      })
      return img
    }
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改文章*/
    http
      .post('/dynamic/update', { id: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改动态成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除文章*/
    http.post('/dynamic/delete', { id: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除动态成功')
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
            <span>动态管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>动态汇总</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card">
        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title="修改动态"
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
                {Object.keys(otherStatusListText).map((key: any) => (
                  <Option key={key} value={key}>
                    {otherStatusListText[key]}
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
                {Object.keys(dynamicTypeText).map((key: any) => (
                  <Option key={key} value={key}>
                    {dynamicTypeText[key]}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="topic_ids"
              label="所属专题"
              rules={[{ required: true }]}
            >
              <Select placeholder="请选择所属专题" allowClear>
                {dynamicTopicAll.map((item: any) => (
                  <Option key={item.topic_id} value={item.topic_id}>
                    {item.name}
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
              <Form.Item label="动态内容">
                <Input
                  value={contentVal}
                  onChange={(e) => {
                    setContentVal(e.target.value)
                  }}
                />
              </Form.Item>
              <Form.Item label="状态">
                <Select
                  className="select-view"
                  value={statusVal}
                  onChange={(value) => {
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
              <Form.Item label="类型">
                <Select
                  className="select-view"
                  value={typeVal}
                  onChange={(value) => {
                    setTypeVal(value)
                  }}
                >
                  <Option value="">全部</Option>
                  {Object.keys(dynamicTypeText).map((key: any) => (
                    <Option key={key} value={key}>
                      {dynamicTypeText[key]}
                    </Option>
                  ))}
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

export default Dynamic
