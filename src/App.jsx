import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Register from './pages/Register'
import Quiz from './pages/Quiz'
import Result from './pages/Result'

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children: [
        {
          path: "register",
          element: <Register/>
        },
        {
          path: "quiz",
          element: <Quiz/>
        },
        {
          path: "result",
          element: <Result/>
        }
      ]
    }
  ])
  return (
    <RouterProvider router={routes}/>
  )
}

export default App