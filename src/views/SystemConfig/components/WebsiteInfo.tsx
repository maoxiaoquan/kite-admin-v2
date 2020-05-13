import React, { useState, useEffect } from 'react'
import { Form, Input, Button } from 'antd'

import http from '@libs/http'

const WebsiteInfo = (props: any) => {
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
      ...props.website,
    })
  }, [form, props.website])

  const onFinish = (values: any) => {
    updateSystemConfig(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const updateSystemConfig = (val: any) => {
    http
      .post('/system-config/update', {
        type: 'website',
        website: {
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
        <h4 className="header-title">网站配置</h4>
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
            label="网站名"
            name="website_name"
            rules={[
              {
                required: true,
                message: '请输入网站名！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="网站名" />
          </Form.Item>

          <Form.Item
            label="logo地址"
            name="logo"
            rules={[
              {
                message: '请输入logo！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="logo" />
          </Form.Item>

          <Form.Item
            label="域名"
            name="domain_name"
            rules={[
              {
                message: '请输入域名！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="域名" />
          </Form.Item>

          <Form.Item
            label="网站介绍"
            name="introduction"
            rules={[
              {
                message: '请输入网站介绍！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="网站介绍" />
          </Form.Item>

          <Form.Item
            label="网站关键词"
            name="keywords"
            rules={[
              {
                message: '请输入网站关键词！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="网站关键词" />
          </Form.Item>

          <Form.Item
            label="网站描述"
            name="description"
            rules={[
              {
                message: '请输入网站描述！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="网站介绍" />
          </Form.Item>

          <Form.Item
            label="备案号"
            name="miibeian"
            rules={[
              {
                message: '请输入备案号！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="备案号" />
          </Form.Item>

          <h3 className="title">侧栏底部信息</h3>

          <Form.Item
            label="关于"
            name="about"
            rules={[
              {
                message: '请输入关于！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="关于" />
          </Form.Item>

          <Form.Item
            label="建议反馈"
            name="feedback"
            rules={[
              {
                message: '请输入建议反馈！',
                whitespace: true,
              },
            ]}
          >
            <Input disabled={!isEdit} placeholder="建议反馈" />
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

export default WebsiteInfo
