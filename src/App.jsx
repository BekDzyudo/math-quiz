import React, { useContext, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import { GlobalContext } from "./context/GlobalContext";

function App() {
  const {userData} = useContext(GlobalContext)

  const routes = createBrowserRouter([
    {
      path: "/quiz",
      element: userData ? <MainLayout /> : <Navigate to="/"/>,
      children: [
        {
          index: true,
          element: <Quiz />,
        },
      ],
    },
    {
      path: "/",
      element: userData ? <Navigate to="/quiz"/> : <Register />,
    },
  ]);
  return <RouterProvider router={routes} />;
}

export default App;
