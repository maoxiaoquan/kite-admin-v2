import React, { PureComponent } from 'react'
import { Layout, Drawer } from 'antd'
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import Header from './Parts/Header' // 头部
import Aside from './Parts/Aside' // 侧栏

const { Content, Footer } = Layout

class Manager extends PureComponent {
  state = {
    isMobile: false,
    collapsed: false
  }

  isMobileFn() {
    const userAgent = navigator.userAgent;
    return userAgent.match(/(iPhone|iPod|Android|ios|iPad|AppleWebKit.*Mobile.*)/i);
  }

  componentDidMount() {
    if (this.isMobileFn()) {
      this.setState({
        isMobile: true
      })
    }
  }


  onCollapseChange = (collapsed: Boolean) => {
    this.setState({
      collapsed
    })
  }

  render() {
    const { collapsed, isMobile } = this.state

    const asideProps = {
      collapsed,
      onCollapseChange: this.onCollapseChange
    }

    const headerProps = {
      collapsed,
      onCollapseChange: this.onCollapseChange
    }

    return (
      <Layout className="admin-manager">
        {isMobile ? (
          <Drawer
            maskClosable
            placement="left"
            closable={false}
            onClose={this.onCollapseChange.bind(this, !collapsed)}
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
          <Content className="admin-content">
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
    )
  }
}

export default Manager
