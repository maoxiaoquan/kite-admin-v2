import React, { lazy, Suspense } from 'react';
import {
  useRoutes,
  Redirect
} from 'react-router-dom';


import Index from '@views/Index/Index'
import Home from '@views/Home/Home'
import Manager from '@views/Manager'
import Demo1 from '@views/Demo/Demo1'
import Demo2 from '@views/Demo/Demo2'
import Demo3 from '@views/Demo/Demo3'
const SignIn = lazy(() => import(/* webpackChunkName: "signIn" */ '@views/Sign/SignIn'))

const App = () => {
  return (
    <>
      {useRoutes([
        { path: '/', element: <Index /> },
        // These are the same as the props you provide to <Route>
        { path: '/sign-in', element: <Suspense fallback={<div>Loading</div>}><SignIn /></Suspense> },
        // 重定向
        // { path: '/', redirectTo: 'demo' },
        {
          path: 'manager',
          element: <Manager />,
          // Nested routes use a children property, which is also
          // the same as <Route>
          children: [
            { path: 'index', element: <Home /> },
            { path: 'demo', element: <Demo2 /> },
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
