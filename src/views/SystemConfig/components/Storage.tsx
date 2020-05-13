import React, { useState, useEffect } from 'react'
import { Form, Select, Input, Button } from 'antd'

import http from '@libs/http'

const Option = Select.Option

const Storage = (props: any) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const [form] = Form.useForm()
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const [serviceProvider, setServiceProvider] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  console.log('props', props)
  useEffect(() => {
    form.setFieldsValue({
      ...props.storage,
    })
  }, [form, props.storage])

  const onFinish = (values: any) => {
    updateSystemConfig(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const updateSystemConfig = (val: any) => {
    http
      .post('/system-config/update', {
        type: 'storage',
        storage: {
          ...val,
        },
      })
      .then((result) => {
        props.getSystemConfigInfo()
        setIsEdit(false)
      })
  }

  return (
    <div className="card layout-card-view">
      <div className="layout-main-title">
        <h4 className="header-title">外部存储</h4>
      </div>
      <div className="config-main">
        <Form
          {...layout}
          name="basic"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="第三方存储服务商"
            name="serviceProvider"
            rules={[
              {
                required: true,
                message: '选择第三方存储服务商！',
                whitespace: true,
              },
            ]}
          >
            <Select
              disabled={!isEdit}
              onChange={(value: any) => {
                setServiceProvider(value)
              }}
            >
              <Option value="default">默认存储本地</Option>
              <Option value="qiniu">七牛</Option>
              <Option value="aliyun">阿里云</Option>
              <Option value="tengxun">腾讯</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="domain"
            name="domain"
            rules={[
              {
                message: 'Please input domain!',
              },
            ]}
          >
            <Input disabled={!isEdit} />
          </Form.Item>

          <Form.Item
            label="bucket"
            name="bucket"
            rules={[
              {
                message: 'Please input bucket!',
              },
            ]}
          >
            <Input disabled={!isEdit} />
          </Form.Item>

          <Form.Item
            label="accessKey"
            name="accessKey"
            rules={[
              {
                message: 'Please input accessKey!',
              },
            ]}
          >
            <Input disabled={!isEdit} />
          </Form.Item>

          <Form.Item
            label="secretKey"
            name="secretKey"
            rules={[
              {
                message: 'Please input secretKey!',
              },
            ]}
          >
            <Input disabled={!isEdit} />
          </Form.Item>

          {serviceProvider === 'qiniu' ? (
            <Form.Item
              label="机房"
              name="zone"
              rules={[
                {
                  message: '选择zone！',
                  whitespace: true,
                },
              ]}
            >
              <Select disabled={!isEdit}>
                <Option value="Zone_z0">华东</Option>
                <Option value="Zone_z1">华北</Option>
                <Option value="Zone_z2">华南</Option>
                <Option value="Zone_na0">北美</Option>
              </Select>
            </Form.Item>
          ) : (
            ''
          )}
          {serviceProvider === 'aliyun' || serviceProvider === 'tengxun' ? (
            <Form.Item
              label="region(bucket所在的区域)"
              name="region"
              rules={[
                {
                  message: 'Please input region!',
                },
              ]}
            >
              <Input disabled={!isEdit} />
            </Form.Item>
          ) : (
            ''
          )}

          <div
            className="aliyun"
            style={{
              display: serviceProvider === 'aliyun' ? 'block' : 'none',
            }}
          >
            <Form.Item
              label="endPoint"
              name="endPoint"
              rules={[
                {
                  message: 'Please input endPoint!',
                },
              ]}
            >
              <Input disabled={!isEdit} />
            </Form.Item>
          </div>

          <Form.Item {...tailLayout}>
            {!isEdit ? (
              <Button
                type="primary"
                onClick={() => {
                  setIsEdit(true)
                }}
              >
                修改
              </Button>
            ) : (
              <div>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>

                <Button
                  onClick={() => {
                    setIsEdit(false)
                  }}
                >
                  取消
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Storage
