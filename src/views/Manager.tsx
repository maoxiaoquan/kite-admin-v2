import React, { useState, useEffect } from 'react'
import { Layout, Drawer } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import Header from '@views/Parts/Header'
import Aside from '@views/Parts/Aside'
import http from '@libs/http'

const { Content, Footer } = Layout; // 头部

const Manager = () => {

  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [allAuthorityNameId, setAllAuthorityNameId] = useState([''])
  const [adminUserInfo, setAdminUserInfo] = useState({})
  const [website, setWebsite] = useState({})


  useEffect(() => {
    getAdminUserInfo()
  }, [])

  const toggle = (val: any) => {
    setCollapsed(val)
    console.log(collapsed)
  };

  const getAdminUserInfo = () => { // 获取后台相关信息
    http.post('/admin-user/info')
      .then((result: any) => {
        setAdminUserInfo(result.data.adminUserInfo || {})
        setWebsite(result.data.website || {})
        setAllAuthorityNameId(result.data.allAuthorityNameId || [])
      })
  }

  const asideProps = {
    collapsed,
    onCollapseChange: toggle,
    allAuthorityNameId,
    website
  }

  const headerProps = {
    collapsed,
    onCollapseChange: toggle,
    adminUserInfo
  }

  return (
    <Layout className="admin-manager">
      {isMobile ? (
        <Drawer
          maskClosable
          placement="left"
          closable={false}
          onClose={() => { toggle(!collapsed) }}
          visible={!collapsed}
          width={200}
          style={{
            padding: 0,
            height: '100vh'
          }}
        >
          <Aside
            {...{
              ...asideProps,
              collapsed: false,
              onCollapseChange: () => { }
            }}
          />
        </Drawer>
      ) : (<Aside {...asideProps} />)}
      <Layout className="admin-wrapper">
        <Header {...headerProps} />
        <Content
          className="admin-content"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />

          <Footer style={{ textAlign: 'center' }}>
            <a href="https://github.com/maoxiaoquan/kite" target="_blank">
              Kite
              </a>
              ©2020
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
}



export default Manager
