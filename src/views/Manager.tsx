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

const { Sider, Content, Footer } = Layout; // 头部

const Manager = () => {

  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [allAuthorityNameId, setAllAuthorityNameId] = useState([''])

  const toggle = (collapsed: any) => {
    setCollapsed(!collapsed)
  };

  const getAdminUserInfo = () => {
    http.post('/admin-user/info')
      .then((result: any) => {
        setAllAuthorityNameId(result.data.allAuthorityNameId)
      })
  }

  useEffect(() => {
    getAdminUserInfo()
  }, [])

  const asideProps = {
    collapsed,
    onCollapseChange: toggle,
    allAuthorityNameId
  }

  const headerProps = {
    collapsed,
    onCollapseChange: toggle
  }


  return (
    <Layout>
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
      ) : (
          <Aside {...asideProps} />
        )}
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
              ©2019
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
}



export default Manager
