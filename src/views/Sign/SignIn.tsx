import React from 'react'
import { Form, Input, Button, Select } from 'antd'
import './SignIn.scss'
import http from '@libs/http'


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function SignIn() {

  const [form] = Form.useForm();

  const onFinish = (values: Object) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  return (
    <div id="admin-sign-in">
      <div className="admin-sign-in-view">
        <div className="admin-sign-in-header">
          <h2>Admin</h2>
        </div>

        <Form className="from-view" {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item name="account" label="Note" rules={[{ required: true, message: '请输入你的账户！' }]} >
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Note" rules={[{ required: true, message: '请输入密码！' }]} >
            <Input />
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