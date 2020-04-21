import React, { useState, useEffect } from 'react'
import { Row, Col, List, Avatar, Breadcrumb } from 'antd'
import Icon from '@ant-design/icons';
import './index.scss'
import http from '@libs/http'

const Home = () => {

  interface Statistics {
    articleBlogCount: any;
    articleCommentCount: any;
    articleCount: any;
    count: any;
    dynamicCommentCount: any;
    dynamicCount: any;
    new_article: any;
    new_comment: any;
    new_user: any;
  }

  const [statistics] = useState<Statistics>({
    articleBlogCount: 0,
    articleCommentCount: 0,
    articleCount: 0,
    count: 0,
    dynamicCommentCount: 0,
    dynamicCount: 0,
    new_article: 0,
    new_comment: 0,
    new_user: 0,
  });




  const [sexs] = useState([
    '未知',
    '男',
    '女'
  ]);



  useEffect(() => {
    http.get('/admin-index/statistics')
      .then((res) => {

      })
  }, [])

  return (
    <div className="layout-index layout-main">
      <div className="layout-main-title">
        <Breadcrumb>
          <Breadcrumb.Item href="#/manager/index">
            <Icon type="home" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#/manager/index">
            <span>主页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>仪表盘</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-statistics">
        <div className="big-statistics">
          <Row gutter={24}>
            <Col span={6} className="count-view">
              <div className="card separate-card">
                <div className="card-body">
                  <div className="float-right">
                    <Icon
                      type="file-text"
                      className="big-widget-icon text-danger"
                    />
                  </div>
                  <h5
                    className="text-muted font-weight-normal mt-0"
                    title="Number of Customers"
                  >
                    文章总数
                    </h5>
                  <h3 className="mt-3 mb-3">{statistics.articleCount.allCount}</h3>
                  <p className="mb-0 text-muted">
                    <span className="text-nowrap">统计所有的文章</span>
                  </p>
                </div>
              </div>
            </Col>

            <Col span={6} className="count-view ">
              <div className="card separate-card">
                <div className="card-body">
                  <div className="float-right">
                    <Icon
                      type="message"
                      className="big-widget-icon text-primary"
                    />
                  </div>
                  <h5
                    className="text-muted font-weight-normal mt-0"
                    title="Number of Customers"
                  >
                    片刻总数
                    </h5>
                  <h3 className="mt-3 mb-3">{statistics.dynamicCount.allCount}</h3>
                  <p className="mb-0 text-muted">
                    <span className="text-nowrap">
                      统计所有的用户发表的说说
                      </span>
                  </p>
                </div>
              </div>
            </Col>

            <Col span={6} className="count-view">
              <div className="card  separate-card">
                <div className="card-body">
                  <div className="float-right">
                    <Icon type="read" className="big-widget-icon text-info" />
                  </div>
                  <h5
                    className="text-muted font-weight-normal mt-0"
                    title="Number of Customers"
                  >
                    个人专栏总数
                    </h5>
                  <h3 className="mt-3 mb-3">{statistics.articleBlogCount.allCount}</h3>
                  <p className="mb-0 text-muted">
                    <span className="text-nowrap">
                      统计所有的个人公开的专栏
                      </span>
                  </p>
                </div>
              </div>
            </Col>

            <Col span={6} className="count-view ">
              <div className="card  separate-card">
                <div className="card-body">
                  <div className="float-right">
                    <Icon
                      type="user"
                      className="big-widget-icon text-primary"
                    />
                  </div>
                  <h5
                    className="text-muted font-weight-normal mt-0"
                    title="Number of Customers"
                  >
                    用户总数
                    </h5>
                  <h3 className="mt-3 mb-3">{statistics.articleCount.allCount}</h3>
                  <p className="mb-0 text-muted">
                    <span className="text-nowrap">统计所有的用户</span>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Row gutter={24}>
          <Col span={10} className="left-view">
            <Row gutter={24}>
              <Col span={12} className="count-view">
                <div className="xsb-card  separate-card">
                  <div className="xsb-card-body">
                    <div className="float-right">
                      <Icon type="read" className="widget-icon" />
                    </div>
                    <h5
                      className="text-muted font-weight-normal mt-0"
                      title="Number of Customers"
                    >
                      个人专栏无需审核
                      </h5>
                    <h3 className="mt-3 mb-3">
                      {statistics.articleBlogCount.noReviewCount}
                    </h3>
                    <p className="mb-0 text-muted">
                      <span className="text-nowrap">
                        统计所有的个人公开的专栏
                        </span>
                    </p>
                  </div>
                </div>
              </Col>

              <Col span={12} className="count-view ">
                <div className="xsb-card  separate-card">
                  <div className="xsb-card-body">
                    <div className="float-right">
                      <Icon type="read" className="widget-icon" />
                    </div>
                    <h5
                      className="text-muted font-weight-normal mt-0"
                      title="Number of Customers"
                    >
                      个人专栏待审核
                      </h5>
                    <h3 className="mt-3 mb-3">{statistics.articleCount.reviewCount}</h3>
                    <p className="mb-0 text-muted">
                      <span className="text-nowrap">统计所有的用户</span>
                    </p>
                  </div>
                </div>
              </Col>

              <Col span={12} className="count-view">
                <div className="xsb-card separate-card">
                  <div className="xsb-card-body">
                    <div className="float-right">
                      <Icon type="file-text" className="widget-icon" />
                    </div>
                    <h5
                      className="text-muted font-weight-normal mt-0"
                      title="Number of Customers"
                    >
                      文章评论总数
                      </h5>
                    <h3 className="mt-3 mb-3">
                      {statistics.articleCommentCount.allCount}
                    </h3>
                    <p className="mb-0 text-muted">
                      <span className="text-nowrap">统计所有的文章评论</span>
                    </p>
                  </div>
                </div>
              </Col>

              <Col span={12} className="count-view ">
                <div className="xsb-card separate-card">
                  <div className="xsb-card-body">
                    <div className="float-right">
                      <Icon type="message" className="widget-icon" />
                    </div>
                    <h5
                      className="text-muted font-weight-normal mt-0"
                      title="Number of Customers"
                    >
                      片刻评论总数
                      </h5>
                    <h3 className="mt-3 mb-3">
                      {statistics.dynamicCommentCount.allCount}
                    </h3>
                    <p className="mb-0 text-muted">
                      <span className="text-nowrap">统计片刻评论总数</span>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={14} className="right-view">
            <div className="card total-card">
              <div className="card-body">
                <h4 className="header-title">数据统计</h4>
                <div className="table-responsive count-view-table">
                  <table
                    className="table table-centered table-hover mb-0"
                  >
                    <tbody>
                      <tr>
                        <th>标题</th>

                        <th>无需审核</th>
                        <th>待审核</th>
                        <th>审核失败</th>
                      </tr>
                      <tr>
                        <td>文章</td>
                        <td>{statistics.articleBlogCount.noReviewCount}</td>
                        <td>{statistics.articleBlogCount.reviewCount}</td>
                        <td>{statistics.articleBlogCount.reviewFailCount}</td>
                      </tr>
                      <tr>
                        <td>文章评论</td>
                        <td>{statistics.articleCommentCount.noReviewCount}</td>
                        <td>{statistics.articleCommentCount.reviewCount}</td>
                        <td>{statistics.articleCommentCount.reviewFailCount}</td>
                      </tr>
                      <tr>
                        <td>动态</td>
                        <td>{statistics.dynamicCount.noReviewCount}</td>
                        <td>{statistics.dynamicCount.reviewCount}</td>
                        <td>{statistics.dynamicCount.reviewFailCount}</td>
                      </tr>
                      <tr>
                        <td>动态评论</td>
                        <td>{statistics.dynamicCommentCount.noReviewCount}</td>
                        <td>{statistics.dynamicCommentCount.reviewCount}</td>
                        <td>{statistics.dynamicCommentCount.reviewFailCount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="layout-detailed">
        <Row gutter={24}>
          <Col span={12}>
            <div className="card clearfix">
              <div className="card-body">
                <div className="header-title">最新文章</div>
                <div className="limit-height">
                  <List
                    itemLayout="horizontal"
                    dataSource={statistics.new_article}
                    renderItem={(item: any) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={item.user.avatar} />}
                          title={
                            <a href={`/p/${item.aid}`}>
                              {item.title} {item.create_dt}
                            </a>
                          }
                          description={item.excerpt}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          </Col>

          <Col span={6}>
            <div className="card clearfix">
              <div className="card-body">
                <div className="header-title">最新注册用户</div>
                <div className="limit-height">
                  <List
                    itemLayout="horizontal"
                    dataSource={statistics.new_user}
                    renderItem={(item: any) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={item.avatar} />}
                          title={
                            <a href={`/user/${item.uid}/blog`}>
                              {item.nickname}
                            </a>
                          }
                          description={sexs[item.sex]}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          </Col>

          <Col span={6}>
            <div className="card clearfix">
              <div className="card-body">
                <div className="header-title">最新评论</div>
                <div className="limit-height">
                  <List
                    itemLayout="horizontal"
                    dataSource={statistics.new_comment}
                    renderItem={(item: any) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={item.user.avatar} />}
                          title={
                            <a href={`/p/${item.aid}`}>
                              {item.user.nickname} {item.create_dt}
                            </a>
                          }
                          description={item.content}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )

}

export default Home
