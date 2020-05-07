import React, { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Breadcrumb, Form, Select, Input, Modal } from 'antd'
import { HomeOutlined, BarChartOutlined } from '@ant-design/icons';
import http from '@libs/http'
import {
  statusList,
  articleType,
  statusListText,
  articleTypeText
} from '@utils/constant'
const Option = Select.Option
const confirm = Modal.confirm

const Article = () => {

  const [titleVal, setTitleVal] = useState('')
  const [statusVal, setStatusVal] = useState('')
  const [typeVal, setTypeVal] = useState('')
  const [sourceVal, setSourceVal] = useState('')
  const [sourceList] = useState(['', '原创', '转载'])
  const [tableList, setTableList] = useState([])
  const [articleTagAll, setArticleTagAll] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text: any, record: any, index: any) => (
        <span
          style={{
            width: '20px',
            display: 'block'
          }}
        >
          {(pagination.current - 1) * 10 + index + 1}
        </span>
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: any, record: any) => (
        <a
          className="article-title"
          target="_blank"
          href={`/p/${record.aid}`}
        >
          {record.title}
        </a>
      )
    },
    {
      title: '概要',
      dataIndex: 'excerpt',
      key: 'excerpt'
    },
    {
      title: '所属标签',
      dataIndex: 'tag_ids',
      key: 'tag_ids',
      render: (value: any, record: any) => {
        return (
          <div className="table-article-tag-view">
            {articleTagAll.map((item: any, key: any) => {
              let tags = record.tag_ids.split(',')
              return tags.map((childItem: any, childKey: any) => {
                if (item.tag_id === childItem) {
                  return (
                    <Tag
                      className="table-article-tag-list"
                      key={childKey}
                      color="orange"
                    >
                      {item.name}
                    </Tag>
                  )
                }
              })
            })}
          </div>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_dt',
      key: 'create_dt'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="orange">
          {statusListText[record.status]}
        </Tag>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="red">
          {articleTypeText[record.type]}
        </Tag>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (text: any, record: any) => {
        return (
          <Tag className="table-article-tag-list" color="red">
            {sourceList[Number(record.source)]}
          </Tag>
        )
      }
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
      key: 'read_count',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="green">
          {record.read_count}
        </Tag>
      )
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      key: 'comment_count',
      render: (text: any, record: any) => (
        <Tag className="table-article-tag-list" color="green">
          {record.comment_count}
        </Tag>
      )
    },
    {
      title: '拒绝的原因',
      dataIndex: 'rejection_reason',
      key: 'rejection_reason',
      render: (text: any, record: any) => (
        <div>
          {Number(record.status) === statusList.reviewFail
            ? record.rejection_reason
            : ''}
        </div>
      )
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: (text, record) => {
    //     return (
    //       <div className="operation-btn">
    //         <button
    //           onClick={() => {
    //             this.editUser(record)
    //           }}
    //           className="btn btn-info"
    //           size="small"
    //           type="primary"
    //         >
    //           <Icon type="edit" />
    //         </button>
    //         <button
    //           className="btn btn-light"
    //           onClick={() => {
    //             this.deleteArticle(record)
    //           }}
    //           size="small"
    //         >
    //           <Icon type="delete" />
    //         </button>
    //       </div>
    //     )
    //   }
    // }
  ];


  const fetchArticleList = (params: any) => {
    http.post('/article/list', params).then((res: any) => {
      setTableList(res.data.list)
      setPagination({
        ...pagination,
        total: res.data.count
      })
    })
  }

  const search = useCallback(() => {
    fetchArticleList({
      title: titleVal,
      source: sourceVal,
      status: statusVal,
      type: typeVal
    })
  }, [fetchArticleList, sourceVal, statusVal, titleVal, typeVal])

  useEffect(() => {
    search()
  }, [search])

  useEffect(() => {
    http.get('/article-tag/all').then(res => {
      setArticleTagAll(res.data.list)
    })
  }, [])


  const resetBarFrom = () => {
    setTitleVal('')
    setStatusVal('')
    setTypeVal('')
    setSourceVal('')
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination)
  };


  return (
    <div className="layout-main">
      <div className="layout-main-title">
        <Breadcrumb>
          <Breadcrumb.Item href="#/manager/index">
            <span>主页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">
            <span>文章管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>文章汇总</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="card">
        <div className="card-body">

          <div className="xsb-operation-menu">
            <Form layout="inline">
              <Form.Item label="文章标题">
                <Input
                  value={titleVal}
                  onChange={e => {
                    setTitleVal(e.target.value)
                  }}
                />
              </Form.Item>
              <Form.Item label="状态">
                <Select
                  className="select-view"
                  value={statusVal}
                  onChange={value => {
                    setStatusVal(value)
                  }}
                >
                  <Option value="">全部</Option>
                  {Object.keys(statusListText).map((key: any) => (
                    <Option key={key} value={key}>
                      {statusListText[key]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="类型">
                <Select
                  className="select-view"
                  value={typeVal}
                  onChange={value => {
                    setTypeVal(value)
                  }}
                >
                  <Option value="">全部</Option>
                  {Object.keys(articleTypeText).map((key: any) => (
                    <Option key={key} value={key}>
                      {articleTypeText[key]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="来源：">
                <Select
                  className="select-view"
                  value={sourceVal}
                  onChange={value => {
                    setSourceVal(value)
                  }}
                >
                  <Option value="">全部</Option>
                  {sourceList.map((item, key) =>
                    item ? (
                      <Option value={key} key={key}>
                        {item}
                      </Option>
                    ) : (
                        ''
                      )
                  )}
                </Select>
              </Form.Item>
              <Form.Item>
                <button
                  className="btn btn-danger"
                  onClick={search}
                >
                  搜索
                  </button>
                <button
                  className="btn btn-primary"
                  onClick={resetBarFrom}
                >
                  重置
                  </button>
              </Form.Item>
            </Form>
          </div>

          <Table columns={columns} pagination={pagination} onChange={handleTableChange} dataSource={tableList} rowKey={record => record.aid} />
        </div>
      </div>
    </div>
  )

}

export default Article
