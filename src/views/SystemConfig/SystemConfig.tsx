import React, { useEffect, useState } from 'react'

import { Breadcrumb, Alert } from 'antd'
import http from '@libs/http'
import EmailBind from './components/EmailBind'
import WebsiteInfo from './components/WebsiteInfo'
import WebConfig from './components/WebConfig'
import Oauth from './components/Oauth'
import Theme from './components/Theme'
import Storage from './components/Storage'

import './SystemConfig.scss'

const SystemConfig = () => {
  const [systemConfigInfo, setSystemConfigInfo] = useState({})
  const getSystemConfigInfo = () => {
    http.get('/system-config/info').then((result: any) => {
      setSystemConfigInfo(result.data)
    })
  }

  useEffect(() => {
    getSystemConfigInfo()
  }, [])

  const props = {
    ...systemConfigInfo,
    getSystemConfigInfo,
  }

  return (
    <div className="layout-main" id="system-config">
      <div className="layout-main-title">
        <Breadcrumb>
          <Breadcrumb.Item href="#/manager/index">
            <span>主页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">
            <span>系统管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>系统配置</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <EmailBind {...props} />
      <WebsiteInfo {...props} />
      <WebConfig {...props} />
      <Oauth {...props} />
      <Theme {...props} />
      <Storage {...props} />
      <Alert
        message="备注"
        description="由于是系统配置，修改时请谨慎，修改成功某些配置后，如果未生效或者出现错误，请务必重启服务"
        type="warning"
        showIcon
      />
    </div>
  )
}

export default SystemConfig
