import React, { lazy, Suspense } from 'react';
import {
  useRoutes
} from 'react-router-dom';


import Home from './views/Home/Index'
const SignIn = lazy(() => import(/* webpackChunkName: "signIn" */ './views/Sign/SignIn'))


const App = () => {
  return (
    <>
      {useRoutes([
        // These are the same as the props you provide to <Route>
        { path: '/', element: <Home /> },
        { path: '/sign-in', element: <Suspense fallback={<div>Loading</div>}><SignIn /></Suspense> },
        {
          path: 'invoices',
          element: <Home />,
          // Nested routes use a children property, which is also
          // the same as <Route>
          children: [
            { path: ':id', element: <Home /> },
            { path: 'sent', element: <Home /> }
          ]
        },
        // Not found routes work as you'd expect
        { path: '*', element: <Home /> }
      ])}
    </>
  )
}

export default App;
