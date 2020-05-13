import React, { useState, useEffect } from 'react'
import { Form, Select, Input, Button } from 'antd'

import http from '@libs/http'

const Option = Select.Option

const EmailBind = (props: any) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const [form] = Form.useForm()
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const [formData, setFormData] = useState({
    type: '',
  })
  const [isEdit, setIsEdit] = useState(false)
  console.log('props', props)
  useEffect(() => {
    form.setFieldsValue({
      ...props.email,
    })
  }, [form, props.email])

  const onGenderChange = (value: any) => {
    setFormData({
      ...formData,
      type: value,
    })
  }

  const onFinish = (values: any) => {
    updateSystemConfig(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const updateSystemConfig = (val: any) => {
    http
      .post('/system-config/update', {
        type: 'email',
        email: {
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
        <h4 className="header-title">邮箱修改or绑定</h4>
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
          <Form.Item name="type" label="系统类型" rules={[{ required: true }]}>
            <Select
              placeholder="请输入系统类型！"
              onChange={onGenderChange}
              allowClear
              disabled={!isEdit}
            >
              <Option value="company">企业</Option>
              <Option value="personal">个人</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="系统邮箱"
            name="user"
            rules={[
              {
                required: true,
                message: '请输入系统邮箱！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} />
          </Form.Item>

          {formData.type === 'company' ? (
            <div>
              <Form.Item
                label="服务商服务器地址"
                name="host"
                rules={[
                  {
                    required: true,
                    message: '请输入服务商服务器地址！',
                    whitespace: true,
                  },
                ]}
              >
                <Input disabled={!isEdit} placeholder="服务器地址" />
              </Form.Item>
              <Form.Item
                label="系统邮箱服务商端口"
                name="port"
                rules={[
                  {
                    required: true,
                    message: '请输入系统邮箱服务商端口！',
                    whitespace: true,
                  },
                ]}
              >
                <Input disabled={!isEdit} placeholder="服务商端口" />
              </Form.Item>
            </div>
          ) : (
            ''
          )}

          {formData.type !== 'company' ? (
            <Form.Item
              label="系统邮箱服务商后缀"
              name="service"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱服务商后缀！',
                  whitespace: true,
                },
              ]}
            >
              <Input disabled={!isEdit} placeholder="（例如：qq、163等等）" />
            </Form.Item>
          ) : (
            ''
          )}

          <Form.Item
            label="系统邮箱密码"
            name="pass"
            rules={[
              {
                required: true,
                message: '请输入邮箱密码！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} type="password" placeholder="邮箱密码" />
          </Form.Item>

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

export default EmailBind
