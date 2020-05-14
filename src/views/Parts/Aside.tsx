import React, { useState, useEffect } from 'react'
import { Menu, Layout } from 'antd'
import { Link } from 'react-router-dom'
import ScrollBar from '@components/ScrollBar'
import {
  PieChartOutlined,
  HeatMapOutlined,
  BarChartOutlined,
  FileTextOutlined,
  MessageOutlined,
  ReadOutlined,
  TeamOutlined,
  ChromeOutlined,
  ControlOutlined,
} from '@ant-design/icons'
import './aside.scss'

const SubMenu = Menu.SubMenu

const Aside = (props: any) => {
  const rootSubmenuKeys = [
    'home',
    'article_mange',
    'bookManager',
    'dynamic',
    'user_manger',
    'web',
    'admin',
  ]

  const [asideItemList] = useState([
    {
      title: '主页',
      key: 'index',
      icon: <PieChartOutlined />,
      link: '/manager/index',
    },
    {
      title: '文章管理',
      key: 'article_mange',
      icon: <FileTextOutlined />,
      children: [
        {
          title: '文章汇总',
          key: 'article',
          link: '/manager/article',
        },
        {
          title: '个人专栏',
          key: 'articleBlog',
          link: '/manager/article-blog',
        },
        {
          title: '文章标签',
          key: 'article_tag',
          link: '/manager/article-tag',
        },
        {
          title: '文章专栏',
          key: 'article_column',
          link: '/manager/article-column',
        },
        {
          title: '文章评论管理',
          key: 'articleComment',
          link: '/manager/article-comment',
        },
      ],
    },
    {
      title: '动态管理',
      key: 'dynamic',
      icon: <MessageOutlined />,
      children: [
        {
          title: '动态汇总',
          key: 'dynamics',
          link: '/manager/dynamic',
        },
        {
          title: '动态话题',
          key: 'dynamicTopic',
          link: '/manager/dynamic-topic',
        },
        {
          title: '动态评论',
          key: 'dynamicComment',
          link: '/manager/dynamic-comment',
        },
      ],
    },
    {
      title: '小书管理',
      key: 'bookManager',
      icon: <ReadOutlined />,
      children: [
        {
          title: '小书',
          key: 'books',
          link: '/manager/books',
        },
        {
          title: '小书章节',
          key: 'book',
          link: '/manager/book',
        },
        {
          title: '小书评论',
          key: 'booksComment',
          link: '/manager/books-comment',
        },
        {
          title: '小书章节评论',
          key: 'bookComment',
          link: '/manager/book-comment',
        },
      ],
    },
    {
      title: '用户管理',
      key: 'user_manger',
      icon: <TeamOutlined />,
      children: [
        {
          title: '用户管理',
          key: 'user',
          link: '/manager/user',
        },
        {
          title: '用户角色',
          key: 'user_role',
          link: '/manager/user-role',
        },
        {
          title: '用户权限',
          key: 'user_authority',
          link: '/manager/user-authority',
        },
        {
          title: '用户头像审核',
          key: 'user_avatar_review',
          link: '/manager/user-avatar-review',
        },
      ],
    },
    {
      title: '网站管理',
      key: 'web',
      icon: <ChromeOutlined />,
      children: [
        {
          title: '网站配置',
          key: 'website_config',
          link: '/manager/website-config',
        },
        {
          title: '图库',
          key: 'picture',
          link: '/manager/picture',
        },
      ],
    },
    {
      title: '系统管理',
      key: 'admin',
      icon: <ControlOutlined />,
      children: [
        {
          title: '管理员管理',
          key: 'admin_user',
          link: '/manager/admin-user',
        },
        {
          title: '角色管理',
          key: 'admin_role',
          link: '/manager/admin-role',
        },
        {
          title: '权限菜单',
          key: 'admin_authority',
          link: '/manager/admin-authority',
        },
        {
          title: '系统配置',
          key: 'system_config',
          link: '/manager/system-config',
        },
        {
          title: '系统日志',
          key: 'admin_system_log',
          link: '/manager/admin-system-log',
        },
      ],
    },
  ])
  const [isMobile, setIsMobile] = useState(false)
  const [openKeys, setOpenKeys] = useState(['web'])
  const [collapsed, setCollapsed] = useState(props.collapsed)

  useEffect(() => {
    setCollapsed(props.collapsed)
  }, [props.collapsed])

  const onOpenChange = (openKeys: any) => {
    const latestOpenKey = openKeys.find(
      (key: any) => openKeys.indexOf(key) === -1
    )
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  const { onCollapseChange, allAuthorityNameId, website } = props

  return (
    <Layout.Sider
      breakpoint="lg"
      width={isMobile ? 200 : 256}
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed, type) => {
        onCollapseChange(collapsed)
      }}
      className="admin-aside-menu"
    >
      <div className="admin-aside-menu-view">
        <div className="admin-aside-header">
          <Link className="admin-logo-view" to="/manager/index">
            <HeatMapOutlined className="login-icon" />
            <span className="logo-text">{website.website_name}</span>
          </Link>
        </div>

        <div className="admin-aside-content clearfix">
          <ScrollBar option={{ suppressScrollX: true }}>
            <Menu
              defaultOpenKeys={['web']}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              theme="dark"
              mode="inline"
            >
              <Menu.Item>
                <Link to="/manager/index">
                  <BarChartOutlined />
                  <span>NAVIGATION</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/manager/index">
                  <PieChartOutlined />
                  <span>仪表盘</span>
                </Link>
              </Menu.Item>
              {asideItemList.map((item: any) => {
                if (item.link && ~allAuthorityNameId.indexOf(item.key)) {
                  return (
                    <Menu.Item key={item.key}>
                      <Link to={item.link}>
                        {item.icon || ''}
                        <span>{item.title}</span>
                      </Link>
                    </Menu.Item>
                  )
                } else if (~allAuthorityNameId.indexOf(item.key)) {
                  return (
                    <SubMenu
                      key={item.key}
                      title={
                        <span>
                          {item.icon}
                          <span>{item.title}</span>
                        </span>
                      }
                    >
                      {item.children.map((childItem: any) => {
                        if (~allAuthorityNameId.indexOf(childItem.key)) {
                          return (
                            <Menu.Item key={childItem.key}>
                              <Link to={childItem.link}>
                                {childItem.icon ? childItem.icon : ''}
                                {childItem.title}
                              </Link>
                            </Menu.Item>
                          )
                        }
                      })}
                    </SubMenu>
                  )
                }
              })}
            </Menu>
          </ScrollBar>
        </div>
      </div>
    </Layout.Sider>
  )
}

export default Aside
