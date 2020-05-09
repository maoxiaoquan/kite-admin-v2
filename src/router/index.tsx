
import React, { lazy, Suspense } from 'react';

import Index from '@views/Index/Index'
import Home from '@views/Home/Home'
import Manager from '@views/Manager'

const Loading = () => {
  return (<div>Loading</div>)
}

const SignIn = lazy(() => import(/* webpackChunkName: "signIn" */ '@views/Sign/SignIn'))
const Article = lazy(() => import(/* webpackChunkName: "Article" */ '@views/Article/Article'))
const ArticleBlog = lazy(() => import(/* webpackChunkName: "ArticleBlog" */ '@views/ArticleBlog/ArticleBlog'))
const ArticleTag = lazy(() => import(/* webpackChunkName: "ArticleTag" */ '@views/ArticleTag/ArticleTag'))
const ArticleColumn = lazy(() => import(/* webpackChunkName: "ArticleColumn" */ '@views/ArticleColumn/ArticleColumn'))
const ArticleComment = lazy(() => import(/* webpackChunkName: "ArticleComment" */ '@views/ArticleComment/ArticleComment'))
const Dynamic = lazy(() => import(/* webpackChunkName: "Dynamic" */ '@views/Dynamic/Dynamic'))
const DynamicTopic = lazy(() => import(/* webpackChunkName: "DynamicTopic" */ '@views/DynamicTopic/DynamicTopic'))
const DynamicComment = lazy(() => import(/* webpackChunkName: "DynamicComment" */ '@views/DynamicComment/DynamicComment'))
const Books = lazy(() => import(/* webpackChunkName: "Books" */ '@views/Books/Books'))
const Book = lazy(() => import(/* webpackChunkName: "Books" */ '@views/Book/Book'))
const BooksComment = lazy(() => import(/* webpackChunkName: "BooksComment" */ '@views/BooksComment/BooksComment'))
const BookComment = lazy(() => import(/* webpackChunkName: "BookComment" */ '@views/BookComment/BookComment'))

export default [
  { path: '/', element: <Index /> },
  // These are the same as the props you provide to <Route>
  { path: '/sign-in', element: <Suspense fallback={<Loading />}><SignIn /></Suspense> },
  // 重定向
  // { path: '/', redirectTo: 'demo' },
  {
    path: 'manager',
    element: <Manager />,
    // Nested routes use a children property, which is also
    // the same as <Route>
    children: [
      { path: 'index', element: <Home /> },
      { path: 'article', element: <Suspense fallback={<Loading />}><Article /></Suspense> },
      { path: 'article-blog', element: <Suspense fallback={<Loading />}><ArticleBlog /></Suspense> },
      { path: 'article-tag', element: <Suspense fallback={<Loading />}><ArticleTag /></Suspense> },
      { path: 'article-column', element: <Suspense fallback={<Loading />}><ArticleColumn /></Suspense> },
      { path: 'article-comment', element: <Suspense fallback={<Loading />}><ArticleComment /></Suspense> },
      { path: 'dynamic', element: <Suspense fallback={<Loading />}><Dynamic /></Suspense> },
      { path: 'dynamic-topic', element: <Suspense fallback={<Loading />}><DynamicTopic /></Suspense> },
      { path: 'dynamic-comment', element: <Suspense fallback={<Loading />}><DynamicComment /></Suspense> },
      { path: 'books', element: <Suspense fallback={<Loading />}><Books /></Suspense> },
      { path: 'book', element: <Suspense fallback={<Loading />}><Book /></Suspense> },
      { path: 'books-comment', element: <Suspense fallback={<Loading />}><BooksComment /></Suspense> },
      { path: 'book-comment', element: <Suspense fallback={<Loading />}><BookComment /></Suspense> },
    ]
  },
  //  { path: '/', redirectTo: '/demo' },
  // Not found routes work as you'd expect
  // { path: '*', element: <Home /> }
]