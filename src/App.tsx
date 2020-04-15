import React from 'react';
import {
  useRoutes
} from 'react-router-dom';
import Home from './views/Home/Index'

import './App.css';


const App = () => {
  let element = useRoutes([
    // These are the same as the props you provide to <Route>
    { path: '/', element: <Home /> },
    { path: 'dashboard', element: <Users /> },
    {
      path: 'invoices',
      element: <Users />,
      // Nested routes use a children property, which is also
      // the same as <Route>
      children: [
        { path: ':id', element: <Users /> },
        { path: 'sent', element: <Users /> }
      ]
    },
    // Not found routes work as you'd expect
    { path: '*', element: <Users /> }
  ]);
  return (
    <>
      {element}
    </>
  )
}

function Users() {
  return (
    <div>
      <nav>
        user
      </nav>


    </div>
  );
}

export default App;
