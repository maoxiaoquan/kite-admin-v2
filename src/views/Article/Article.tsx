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

const Article = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }
  const [titleVal, setTitleVal] = useState('')
  const [statusVal, setStatusVal] = useState('')
  const [typeVal, setTypeVal] = useState('')
  const [sourceVal, setSourceVal] = useState('')
  const [sourceList] = useState(['', '原创', '转载'])
  const [tableList, setTableList] = useState([])
  const [articleTagAll, setArticleTagAll] = useState([])
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
    http.get('/article-tag/all').then((res) => {
      setArticleTagAll(res.data.list)
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
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: any, record: any) => (
        <a
          className="article-title"
          target="tag"
          rel="chapter"
          href={`/p/${record.aid}`}
        >
          {record.title}
        </a>
      ),
    },
    {
      title: '概要',
      dataIndex: 'excerpt',
      key: 'excerpt',
    },
    {
      title: '所属标签',
      dataIndex: 'tag_ids',
      key: 'tag_ids',
      render: (value: any, record: any) => {
        return (
          <div className="table-article-tag-view">
            {articleTagAll.map((item: any, key: any) => {
              let tags = record.tag_ids.split(',')
              return tags.map((childItem: any, childKey: any) => {
                if (item.tag_id === childItem) {
                  return (
                    <Tag
                      className="table-article-tag-list"
                      key={childKey}
                      color="orange"
                    >
                      {item.name}
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
      title: '创建时间',
      dataIndex: 'create_dt',
      key: 'create_dt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="orange">
          {statusListText[record.status]}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="red">
          {articleTypeText[record.type]}
        </Tag>
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (text: any, record: any) => {
        return (
          <Tag className="table-article-tag-list" color="red">
            {sourceList[Number(record.source)]}
          </Tag>
        )
      },
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
      key: 'read_count',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="green">
          {record.read_count}
        </Tag>
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
          {Number(record.status) === statusList.reviewFail
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
    setOperationId(val.aid)
    form.setFieldsValue({
      status: String(val.status),
      type: String(val.type),
      source: val.source,
      rejection_reason: val.rejection_reason,
      tag_ids: val.tag_ids ? val.tag_ids.split(',') : [],
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此文章吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.aid)
        /*删除文章*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const search = useCallback(() => {
    http
      .post('/article/list', {
        title: titleVal,
        source: sourceVal,
        status: statusVal,
        type: typeVal,
        page: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination, sourceVal, statusVal, titleVal, typeVal])

  useEffect(() => {
    http
      .post('/article/list', {
        source: sourceVal,
        status: statusVal,
        type: typeVal,
        page: pagination.current,
        pageSize: pagination.pageSize,
      })
      .then((result: any) => {
        setTableList(result.data.list)
        setTotal(result.data.count)
      })
  }, [pagination, sourceVal, statusVal, typeVal])

  const resetBarFrom = () => {
    setTitleVal('')
    setStatusVal('')
    setTypeVal('')
    setSourceVal('')
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
      .post('/article/edit', { aid: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改文章成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*修改文章*/
    http.post('/article/delete', { aid: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除文章成功')
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
            <span>文章管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>文章汇总</Breadcrumb.Item>
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
                {Object.keys(statusListText).map((key: any) => (
                  <Option key={key} value={key}>
                    {statusListText[key]}
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

            <Form.Item
              name="tag_ids"
              label="所属标签"
              rules={[{ required: true }]}
            >
              <Select placeholder="请选择所属标签" allowClear mode="multiple">
                {articleTagAll.map((item: any) => (
                  <Option key={item.tag_id} value={item.tag_id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="source" label="来源" rules={[{ required: true }]}>
              <Select placeholder="请选择来源！" allowClear>
                {sourceList.map((item: any, key: any) =>
                  item ? (
                    <Option key={key} value={key}>
                      {item}
                    </Option>
                  ) : (
                    ''
                  )
                )}
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
              <Form.Item label="文章标题">
                <Input
                  value={titleVal}
                  onChange={(e) => {
                    setTitleVal(e.target.value)
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
                  {Object.keys(statusListText).map((key: any) => (
                    <Option key={key} value={key}>
                      {statusListText[key]}
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
                  {Object.keys(articleTypeText).map((key: any) => (
                    <Option key={key} value={key}>
                      {articleTypeText[key]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="来源：">
                <Select
                  className="select-view"
                  value={sourceVal}
                  onChange={(value) => {
                    setSourceVal(value)
                  }}
                >
                  <Option value="">全部</Option>
                  {sourceList.map((item, key) =>
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

export default Article
