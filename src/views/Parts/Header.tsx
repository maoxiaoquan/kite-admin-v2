import React, { Component, useState } from 'react'
import {
  Menu,
  Avatar,
  Layout,
  Button
} from 'antd'
import './header.scss'
import { useNavigate } from 'react-router-dom';
import Icon, { HomeOutlined } from '@ant-design/icons';
const SubMenu = Menu.SubMenu

const { Header } = Layout

const HeaderBox = (props: any) => {

  const [current, setCurrent] = useState()
  const [user, setUser] = useState({
    avatar: '',
    nickname: '',
    account: '',
  })

  const topMenuClick = (e: any) => {
    setCurrent(e.key)
  }
  let navigate = useNavigate();

  const escLogin = () => {
    localStorage.box_tokens = ''
    navigate('/sign-in')
  }


  const {
    collapsed,
    onCollapseChange,
  } = props


  return (
    <Header
      className={`k-header ${collapsed}`}
    >
      <div className="clearfix">
        <div className="pull-left">
          <Button onClick={() => onCollapseChange(!collapsed)} icon={collapsed ? <HomeOutlined /> : <HomeOutlined />}></Button>
        </div>
        <div className="pull-right">
          <Menu
            onClick={topMenuClick}
            selectedKeys={current}
            mode="horizontal"
          >
            <Menu.Item key="alipay" />
            <SubMenu
              title={
                <div className="personal">
                  <Avatar src={user.avatar} />
                  <div className="personal-info">
                    <span className="name">{user.nickname}</span>
                    <span className="role">{user.account}</span>
                  </div>
                </div>
              }
            >
              {/* <Menu.Item key="setting:1">个人资料</Menu.Item>*/}
              <Menu.Item key="setting" onClick={escLogin}>
                退出
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    </Header>
  )
}

export default HeaderBox
