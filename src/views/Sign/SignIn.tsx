import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './SignIn.scss'
import http from '@libs/http'


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface signIn {
  account: string;
  password: string;
}


function SignIn() {

  let navigate = useNavigate();
  const [form] = Form.useForm();

  const signIn = (data: signIn) => {
    http.post('/sign-in', data).then((result: any) => {
      console.log('result', result)
      if (result.state === 'success') {
        localStorage.box_tokens = result.token
        navigate('/')
      }
    })
  }

  const onFinish = (values: any) => {
    signIn(values)
  };

  return (
    <div id="admin-sign-in">
      <div className="admin-sign-in-view">
        <div className="admin-sign-in-header">
          <h2>Admin</h2>
        </div>

        <Form className="from-view" {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item name="account" rules={[{ required: true, message: '请输入你的账户！' }]} >
            <Input className="from-view-input" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]} >
            <Input.Password className="from-view-input" prefix={<LockFilled />} />
          </Form.Item>
          <Form.Item>
            <Button className="sign-in-btn" htmlType="submit" type="primary">
              登录
              </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default SignIn