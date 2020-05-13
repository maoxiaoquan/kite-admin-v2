import React, { lazy, Suspense } from 'react'

import Index from '@views/Index/Index'
import Home from '@views/Home/Home'
import Manager from '@views/Manager'

const Loading = () => {
  return <div>Loading</div>
}

const SignIn = lazy(() =>
  import(/* webpackChunkName: "signIn" */ '@views/Sign/SignIn')
)
const Article = lazy(() =>
  import(/* webpackChunkName: "Article" */ '@views/Article/Article')
)
const ArticleBlog = lazy(() =>
  import(/* webpackChunkName: "ArticleBlog" */ '@views/ArticleBlog/ArticleBlog')
)
const ArticleTag = lazy(() =>
  import(/* webpackChunkName: "ArticleTag" */ '@views/ArticleTag/ArticleTag')
)
const ArticleColumn = lazy(() =>
  import(
    /* webpackChunkName: "ArticleColumn" */ '@views/ArticleColumn/ArticleColumn'
  )
)
const ArticleComment = lazy(() =>
  import(
    /* webpackChunkName: "ArticleComment" */ '@views/ArticleComment/ArticleComment'
  )
)
const Dynamic = lazy(() =>
  import(/* webpackChunkName: "Dynamic" */ '@views/Dynamic/Dynamic')
)
const DynamicTopic = lazy(() =>
  import(
    /* webpackChunkName: "DynamicTopic" */ '@views/DynamicTopic/DynamicTopic'
  )
)
const DynamicComment = lazy(() =>
  import(
    /* webpackChunkName: "DynamicComment" */ '@views/DynamicComment/DynamicComment'
  )
)
const Books = lazy(() =>
  import(/* webpackChunkName: "Books" */ '@views/Books/Books')
)
const Book = lazy(() =>
  import(/* webpackChunkName: "Books" */ '@views/Book/Book')
)
const BooksComment = lazy(() =>
  import(
    /* webpackChunkName: "BooksComment" */ '@views/BooksComment/BooksComment'
  )
)
const BookComment = lazy(() =>
  import(/* webpackChunkName: "BookComment" */ '@views/BookComment/BookComment')
)
const User = lazy(() =>
  import(/* webpackChunkName: "User" */ '@views/User/User')
)

const UserRole = lazy(() =>
  import(/* webpackChunkName: "UserRole" */ '@views/UserRole/UserRole')
)

const UserAuthority = lazy(() =>
  import(
    /* webpackChunkName: "UserAuthority" */ '@views/UserAuthority/UserAuthority'
  )
)

const UserAvatarReview = lazy(() =>
  import(
    /* webpackChunkName: "UserAvatarReview" */ '@views/UserAvatarReview/UserAvatarReview'
  )
)

const WebsiteConfig = lazy(() =>
  import(
    /* webpackChunkName: "WebsiteConfig" */ '@views/WebsiteConfig/WebsiteConfig'
  )
)

const Picture = lazy(() =>
  import(/* webpackChunkName: "Picture" */ '@views/Picture/Picture')
)

const AdminUser = lazy(() =>
  import(/* webpackChunkName: "AdminUser" */ '@views/AdminUser/AdminUser')
)

const AdminRole = lazy(() =>
  import(/* webpackChunkName: "AdminRole" */ '@views/AdminRole/AdminRole')
)

const AdminAuthority = lazy(() =>
  import(
    /* webpackChunkName: "AdminAuthority" */ '@views/AdminAuthority/AdminAuthority'
  )
)

const AdminSystemLog = lazy(() =>
  import(
    /* webpackChunkName: "AdminSystemLog" */ '@views/AdminSystemLog/AdminSystemLog'
  )
)

const SystemConfig = lazy(() =>
  import(
    /* webpackChunkName: "SystemConfig" */ '@views/SystemConfig/SystemConfig'
  )
)

export default [
  { path: '/', element: <Index /> },
  // These are the same as the props you provide to <Route>
  {
    path: '/sign-in',
    element: (
      <Suspense fallback={<Loading />}>
        <SignIn />
      </Suspense>
    ),
  },
  // 重定向
  // { path: '/', redirectTo: 'demo' },
  {
    path: 'manager',
    element: <Manager />,
    // Nested routes use a children property, which is also
    // the same as <Route>
    children: [
      { path: 'index', element: <Home /> },
      {
        path: 'article',
        element: (
          <Suspense fallback={<Loading />}>
            <Article />
          </Suspense>
        ),
      },
      {
        path: 'article-blog',
        element: (
          <Suspense fallback={<Loading />}>
            <ArticleBlog />
          </Suspense>
        ),
      },
      {
        path: 'article-tag',
        element: (
          <Suspense fallback={<Loading />}>
            <ArticleTag />
          </Suspense>
        ),
      },
      {
        path: 'article-column',
        element: (
          <Suspense fallback={<Loading />}>
            <ArticleColumn />
          </Suspense>
        ),
      },
      {
        path: 'article-comment',
        element: (
          <Suspense fallback={<Loading />}>
            <ArticleComment />
          </Suspense>
        ),
      },
      {
        path: 'dynamic',
        element: (
          <Suspense fallback={<Loading />}>
            <Dynamic />
          </Suspense>
        ),
      },
      {
        path: 'dynamic-topic',
        element: (
          <Suspense fallback={<Loading />}>
            <DynamicTopic />
          </Suspense>
        ),
      },
      {
        path: 'dynamic-comment',
        element: (
          <Suspense fallback={<Loading />}>
            <DynamicComment />
          </Suspense>
        ),
      },
      {
        path: 'books',
        element: (
          <Suspense fallback={<Loading />}>
            <Books />
          </Suspense>
        ),
      },
      {
        path: 'book',
        element: (
          <Suspense fallback={<Loading />}>
            <Book />
          </Suspense>
        ),
      },
      {
        path: 'books-comment',
        element: (
          <Suspense fallback={<Loading />}>
            <BooksComment />
          </Suspense>
        ),
      },
      {
        path: 'book-comment',
        element: (
          <Suspense fallback={<Loading />}>
            <BookComment />
          </Suspense>
        ),
      },
      {
        path: 'user',
        element: (
          <Suspense fallback={<Loading />}>
            <User />
          </Suspense>
        ),
      },
      {
        path: 'user-role',
        element: (
          <Suspense fallback={<Loading />}>
            <UserRole />
          </Suspense>
        ),
      },
      {
        path: 'user-authority',
        element: (
          <Suspense fallback={<Loading />}>
            <UserAuthority />
          </Suspense>
        ),
      },
      {
        path: 'user-avatar-review',
        element: (
          <Suspense fallback={<Loading />}>
            <UserAvatarReview />
          </Suspense>
        ),
      },
      {
        path: 'website-config',
        element: (
          <Suspense fallback={<Loading />}>
            <WebsiteConfig />
          </Suspense>
        ),
      },
      {
        path: 'picture',
        element: (
          <Suspense fallback={<Loading />}>
            <Picture />
          </Suspense>
        ),
      },
      {
        path: 'admin-user',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminUser />
          </Suspense>
        ),
      },
      {
        path: 'admin-role',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminRole />
          </Suspense>
        ),
      },
      {
        path: 'admin-authority',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminAuthority />
          </Suspense>
        ),
      },
      {
        path: 'admin-system-log',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminSystemLog />
          </Suspense>
        ),
      },
      {
        path: 'system-config',
        element: (
          <Suspense fallback={<Loading />}>
            <SystemConfig />
          </Suspense>
        ),
      },
    ],
  },
  //  { path: '/', redirectTo: '/demo' },
  // Not found routes work as you'd expect
  { path: '*', element: <Index /> },
]
