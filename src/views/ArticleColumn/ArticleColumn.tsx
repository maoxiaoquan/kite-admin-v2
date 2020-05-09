import React, { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Breadcrumb, Form, Select, Input, Modal, Button, message, Switch, InputNumber } from 'antd'
import { DeleteOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
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

const ArticleTag = () => {

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const [tableList, setTableList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [total, setTotal] = useState(0)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [operationId, setOperationId] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [form] = Form.useForm();
  const [articleTagAll, setArticleTagAll] = useState([])

  useEffect(() => {
    http.get('/article-tag/all').then(res => {
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
      title: '专栏单词',
      dataIndex: 'en_name',
      key: 'en_name'
    },
    {
      title: '专栏图标',
      dataIndex: 'icon',
      key: 'icon'
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort'
    },
    {
      title: '专栏图标演示',
      dataIndex: 'icon',
      key: 'article_column_icon_demo',
      render: (value: any, record: any) => {
        return (
          <div className="avatar img-preview">
            <img className="tag-img-icon" src={record.icon} alt="" />
          </div>
        )
      }
    },
    {
      title: '下属专题',
      dataIndex: 'tag_ids',
      key: 'tag_ids',
      render: (value: any, record: any) => {
        return (
          <div className="table-article-tag-view">
            {articleTagAll.map((item: any, key: any) => {
              let tags = record.tag_ids ? record.tag_ids.split(',') : []
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
      }
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '是否首页显示',
      dataIndex: 'is_home',
      key: 'is_home',
      render: (value: any, record: any) => {
        return (
          <div className="table-is-login">
            {value ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </div>
        )
      }
    },
    {
      title: '是否可以用',
      dataIndex: 'enable',
      key: 'enable',
      render: (value: any, record: any) => {
        return (
          <div className="table-is-login">
            {value ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </div>
        )
      }
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
      }
    }
  ];


  const editData = (val: any) => {
    showModal('edit')
    setOperationId(val.tag_id)
    form.setFieldsValue({
      ...val
    });
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此文章吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.column_id)
        /*删除文章*/
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const search = useCallback(() => {
    http.get('/article-column/list', {
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

  useEffect(() => {
    search()
  }, [search])


  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination)
  };

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
      form.resetFields()
    } else {
      fetchEdit(values)
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const fetchCreate = (values: editArticleInfo) => {
    /*创建文章标签*/
    http.post('/article-column/create', { ...values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('创建文章标签成功');
    })
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改文章标签*/
    http.post('/article-column/update', { column_id: operationId, ...values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('修改文章标签成功');
    })
  }

  const fetchDelete = (values: String) => {
    /*删除文章标签*/
    http.post('/article-column/delete', { column_id: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除文章标签成功');
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
          <Breadcrumb.Item>文章专栏</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-nav-btn">
        <button
          className="btn btn-danger"
          onClick={() => {
            showModal('add')
          }}
        >
          创建专栏
          </button>
      </div>

      <div className="card">

        <Modal
          footer={null}
          getContainer={false}
          onCancel={() => {
            setIsVisibleEdit(false)
          }}
          title={isCreate ? '创建专栏' : '修改专栏'}
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

            <Form.Item label="专栏名" name="name" rules={[{
              required: true,
              message: '请输入专栏名！',
              whitespace: true
            }]}>
              <Input />
            </Form.Item>

            <Form.Item label="专栏名单词" name="en_name" rules={[{
              required: true,
              message: '请输入专栏名单词！',
              whitespace: true
            }]}>
              <Input />
            </Form.Item>

            <Form.Item label="专栏图标地址" name="icon" rules={[{
              required: true,
              message: '请输入专栏图标！',
              whitespace: true
            }]}>
              <Input />
            </Form.Item>

            <Form.Item name="tag_ids" label="专栏下属专题" rules={[{ required: true }]}>
              <Select
                allowClear
                mode="multiple"
                placeholder="请选择文章专栏下属专题"
              >
                {articleTagAll.map((item: any) => (
                  <Option key={item.tag_id} value={item.tag_id} >{item.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="sort" label="排序" rules={[{
              required: true,
              message: '请输入排序',
            }]}>
              <InputNumber min={0} max={50} />
            </Form.Item>

            <Form.Item label="专栏描述" name="description" rules={[{
              required: true,
              message: '请输入专栏描述',
              whitespace: true
            }]}>
              <Input.TextArea />
            </Form.Item>

            <Form.Item label="是否首页显示" name="is_home" valuePropName="checked" rules={[{
              required: true,
              message: '请选择是否首页显示',
            }]}>
              <Switch />
            </Form.Item>

            <Form.Item label="是否有效" name="enable" valuePropName="checked" rules={[{
              required: true,
              message: '请选择是否有效',
            }]}>
              <Switch />
            </Form.Item>

            <Form.Item {...tailLayout}>
              {
                isCreate ? <Button type="primary" htmlType="submit">
                  创建
              </Button> : <Button type="primary" htmlType="submit">
                    修改
              </Button>
              }

              <Button onClick={() => {
                setIsVisibleEdit(false)
              }}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <div className="card-body">
          <Table columns={columns} pagination={{ ...pagination, total }} onChange={handleTableChange} dataSource={tableList} rowKey={record => record.column_id} />
        </div>
      </div>
    </div>
  )

}

export default ArticleTag
