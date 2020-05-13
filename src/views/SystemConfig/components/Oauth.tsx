import React, { useState, useEffect, useCallback } from 'react'
import { Form, Input, Button, Checkbox, Row, Col } from 'antd'

import http from '@libs/http'

const Oauth = (props: any) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const oauth = props.oauth
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const [form] = Form.useForm()

  const [formData, setFormData] = useState({
    oauths: [''],
  })
  const [isEdit, setIsEdit] = useState(false)
  const onGenderChange = useCallback((value: any) => {
    setFormData({
      oauths: value,
    })
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      oauths: oauth?.oauths || [''],
      githubClientId: oauth?.oauth_github.client_id || '',
      githubClientSecret: oauth?.oauth_github.client_secret || '',
      githubRedirectUri: oauth?.oauth_github.redirect_uri || '',
    })
    onGenderChange(oauth?.oauths || [''])
  }, [form, oauth, onGenderChange])

  const onFinish = (values: any) => {
    updateSystemConfig(values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const updateSystemConfig = (val: any) => {
    http
      .post('/system-config/update', {
        type: 'oauth',
        oauth: {
          oauths: val.oauths,
          oauth_github: {
            client_id: val.githubClientId,
            client_secret: val.githubClientSecret,
            redirect_uri: val.githubRedirectUri,
          },
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
        <h4 className="header-title">第三方oauth登录</h4>
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
          <Form.Item label="勾选第三方授权登录" name="oauths">
            <Checkbox.Group
              style={{ width: '100%' }}
              disabled={!isEdit}
              onChange={(checkedValues: any) => {
                onGenderChange(checkedValues)
              }}
            >
              <Row>
                <Col span={8}>
                  <Checkbox value="github">github</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="qq">qq</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          {~formData.oauths.indexOf('github') ? (
            <div className="github">
              <div className="github-title">github授权登录</div>

              <Form.Item
                label="client_id"
                name="githubClientId"
                rules={[
                  {
                    required: true,
                    message: 'Please input client_id!',
                  },
                ]}
              >
                <Input disabled={!isEdit} />
              </Form.Item>

              <Form.Item
                label="client_secret"
                name="githubClientSecret"
                rules={[
                  {
                    required: true,
                    message: 'Please input client_secret!',
                  },
                ]}
              >
                <Input disabled={!isEdit} />
              </Form.Item>

              <Form.Item
                label="redirect_uri（当前域名+/oauth/github 此段是必须固定）"
                name="githubRedirectUri"
                rules={[
                  {
                    required: true,
                    message: 'Please input redirect_uri!',
                  },
                ]}
              >
                <Input disabled={!isEdit} />
              </Form.Item>
            </div>
          ) : (
            ''
          )}

          <div
            className="qq"
            style={{
              display: ~formData.oauths.indexOf('qq') ? 'block' : 'none',
            }}
          >
            <div className="qq-title">qq授权登录(暂未开放)</div>
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

export default Oauth
