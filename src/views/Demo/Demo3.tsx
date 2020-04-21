import React, { useEffect } from 'react'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import http from '@libs/http'
import { Outlet } from "react-router-dom";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

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

  useEffect(() => {
    navigate('/demo')
  })

  return (
    <div id="admin-sign-in">
      <div className="admin-sign-in-view">
        <div className="admin-sign-in-header">
          <h2>3333333333333</h2>
        </div>
      </div>
    </div>
  );
}

export default SignIn