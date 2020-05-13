import React, { useState, useEffect } from 'react'
import { Form, Select, Button } from 'antd'

import http from '@libs/http'

const Option = Select.Option

const Theme = (props: any) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  const [form] = Form.useForm()
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const [isEdit, setIsEdit] = useState(false)
  const [themeList, setThemeList] = useState([])

  useEffect(() => {
    form.setFieldsValue({
      ...props.storage,
    })
  }, [form, props.storage])

  useEffect(() => {
    http.get('/system-config/theme-list').then((result) => {
      setThemeList(result?.data?.list || [])
    })
  }, [])

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
        <h4 className="header-title">主题功能</h4>
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
            label="选择主题"
            name="theme"
            rules={[
              {
                required: true,
                message: '选择主题！',
                whitespace: true,
              },
            ]}
          >
            <Select disabled={!isEdit}>
              {themeList.map((item: any, key: any) => {
                return (
                  <Option value={item} key="key">
                    {item}
                  </Option>
                )
              })}
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

export default Theme
