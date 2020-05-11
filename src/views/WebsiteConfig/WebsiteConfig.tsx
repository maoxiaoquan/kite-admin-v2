import React from 'react'
import { Breadcrumb, Alert } from 'antd'
import Notice from './components/Notice'
import Advertise from './components/Advertise'
import './WebsiteConfig.scss'

const WebsiteConfig = () => {
  return (
    <div className="layout-main" id="system-config">
      <div className="layout-main-title">
        <Breadcrumb>
          <Breadcrumb.Item href="#/manager/index">
            <span>主页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">
            <span>网站管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>网站配置</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Notice />
      <Advertise />
      <Alert
        message="备注"
        description="应用于网站的某些配置公告等等"
        type="warning"
        showIcon
      />
    </div>
  )
}

export default WebsiteConfig
