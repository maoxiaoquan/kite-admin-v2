import React, { lazy, Suspense } from 'react';
import {
  useRoutes
} from 'react-router-dom';

import Index from '@views/Index/Index'
import Home from '@views/Home/Home'
import Manager from '@views/Manager'


const Loading = () => {
  return (<div>Loading</div>)
}

const SignIn = lazy(() => import(/* webpackChunkName: "signIn" */ '@views/Sign/SignIn'))
const Article = lazy(() => import(/* webpackChunkName: "signIn" */ '@views/Article/Article'))

const App = () => {
  return (
    <>
      {useRoutes([
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
          ]
        },
        //  { path: '/', redirectTo: '/demo' },
        // Not found routes work as you'd expect
        // { path: '*', element: <Home /> }
      ])}
    </>
  )
}

export default App;
