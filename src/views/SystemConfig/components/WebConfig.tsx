import React, { useState, useEffect } from 'react'
import { Form, Select, Input, Button } from 'antd'

import http from '@libs/http'

const Option = Select.Option

const WebConfig = (props: any) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const [form] = Form.useForm()
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const [isEdit, setIsEdit] = useState(false)
  console.log('props', props)
  useEffect(() => {
    form.setFieldsValue({
      ...props.config,
    })
  }, [form, props.config])

  const onFinish = (values: any) => {
    updateSystemConfig(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const updateSystemConfig = (val: any) => {
    http
      .post('/system-config/update', {
        type: 'config',
        config: {
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
        <h4 className="header-title">网站功能</h4>
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
            label="开启登录"
            name="on_login"
            rules={[
              {
                required: true,
                message: '请选择是否开启登录！',
                whitespace: true,
              },
            ]}
          >
            <Select disabled={!isEdit}>
              <Option value="yes">开启</Option>
              <Option value="no">关闭</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="开启注册"
            name="on_register"
            rules={[
              {
                required: true,
                message: '请选择是否开启注册！',
                whitespace: true,
              },
            ]}
          >
            <Select disabled={!isEdit}>
              <Option value="yes">开启</Option>
              <Option value="no">关闭</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="开启评论模块"
            name="on_comment"
            rules={[
              {
                required: true,
                message: '请选择是否开启评论模块！',
                whitespace: true,
              },
            ]}
          >
            <Select disabled={!isEdit}>
              <Option value="yes">开启</Option>
              <Option value="no">关闭</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="后台管理界面访问地址"
            name="admin_url"
            rules={[
              {
                required: true,
                message: '请输入后台管理界面访问地址！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="后台管理界面访问地址" />
          </Form.Item>

          <Form.Item
            label="google统计code"
            name="googleCode"
            rules={[
              {
                message: '请输入google统计code！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="google统计code" />
          </Form.Item>

          <Form.Item
            label="开启百度自动推送"
            name="isBaiduAuthPush"
            rules={[
              {
                message: '请选择是否开启百度自动推送！',
                whitespace: true,
              },
            ]}
          >
            <Select disabled={!isEdit}>
              <Option value="yes">开启</Option>
              <Option value="no">关闭</Option>
            </Select>
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

export default WebConfig
