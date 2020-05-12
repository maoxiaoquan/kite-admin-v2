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
  Upload,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
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

const Picture = () => {
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
  const [imageUrl, setImageUrl] = useState('')
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
      title: '图片标题',
      dataIndex: 'picture_title',
      key: 'picture_title',
    },
    {
      title: '图片说明',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '图片地址',
      dataIndex: 'picture_url',
      key: 'picture_url',
    },
    {
      title: '图片演示',
      dataIndex: 'picture_url',
      key: 'picture_show',
      render: (value: any, record: any) => {
        return (
          <div className="avatar img-preview">
            <img src={record.picture_url} alt="" />
          </div>
        )
      },
    },
    {
      title: '是否可用',
      dataIndex: 'enable',
      key: 'enable',
      render: (value: any, record: any) => {
        return (
          <div className="table-is-login">
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
    showModal('edit')
    setOperationId(val.picture_id)
    form.setFieldsValue({
      ...val,
    })
  }

  const deleteData = (val: any) => {
    confirm({
      title: '确认要删除此图片吗？',
      content: '此操作不可逆转',
      okText: 'Yes',

      cancelText: 'No',
      onOk: () => {
        fetchDelete(val.picture_id)
        /*删除图片*/
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const search = useCallback(() => {
    http
      .get('/picture/list', {
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
    /*创建图片*/
    http.post('/picture/create', { ...values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('创建图片成功')
    })
  }

  const fetchEdit = (values: editArticleInfo) => {
    /*修改图片*/
    http
      .post('/picture/update', { picture_id: operationId, ...values })
      .then((result: any) => {
        search()
        setIsVisibleEdit(false)
        message.success('修改图片成功')
      })
  }

  const fetchDelete = (values: String) => {
    /*删除图片*/
    http.post('/picture/delete', { picture_id: values }).then((result: any) => {
      search()
      setIsVisibleEdit(false)
      message.success('删除图片成功')
    })
  }

  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  function getBase64(img: any, callback: any) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const handleChange = (info: any) => {
    console.log('info', info)
    if (info.file.status === 'uploading') {
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) =>
        setImageUrl(info.file.response.data.filename)
      )
    }
  }

  const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  return (
    <div className="layout-main">
      <div className="layout-main-title">
        <Breadcrumb>
          <Breadcrumb.Item href="#/manager/index">
            <span>主页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">
            <span>网站管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>图片</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-nav-btn">
        <button
          className="btn btn-danger"
          onClick={() => {
            showModal('add')
          }}
        >
          创建图片
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
              label="图片标题"
              name="picture_title"
              rules={[
                {
                  required: true,
                  message: '请输入图片标题！',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="图片说明"
              name="description"
              rules={[
                {
                  required: true,
                  message: '图片说明！',
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
              name="picture_url"
              label="Upload"
              getValueFromEvent={normFile}
              valuePropName="fileList"
              extra="long"
            >
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/api-admin/v1/upload/picture"
                headers={{ 'x-access-token': localStorage.box_tokens }}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="img" style={{ width: '100%' }} />
                ) : (
                  <div className="ant-upload-text">Upload</div>
                )}
              </Upload>
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
          <Table
            columns={columns}
            pagination={{ ...pagination, total }}
            onChange={handleTableChange}
            dataSource={tableList}
            rowKey={(record) => record.picture_id}
          />
        </div>
      </div>
    </div>
  )
}

export default Picture
