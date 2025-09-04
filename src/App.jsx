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
import Login from "./pages/Login";
import OptionQuiz from "./pages/optionQuiz";
import AttestatsiyaTestlari from "./pages/AttestatsiyaTestlari";
import NewPassword from "./pages/NewPassword";

function App() {
  const {userData} = useContext(GlobalContext)

  const routes = createBrowserRouter([
    // {
    //   path: "/",
    //   element: userData ? <MainLayout /> : <Navigate to="/login"/>,
    //   children: [
    //     {
    //       index: true,
    //       element: <Quiz />,
    //     },
    //   ],
    // },
     {
      path: "/",
      element: userData ? <MainLayout /> : <Navigate to="/login"/>,
      children: [
        {
          index: true,
          element: <OptionQuiz />,
        },
        {
          path: "quiz/:quizId",
          element: <Quiz />,
        },
      ],
    },
    // {
    //   path: "/option",
    //   element: userData ? <OptionQuiz /> : <Navigate to="/login"/>,
    // },
    {
      path: "/attestatsiya-testlari",
      element: <AttestatsiyaTestlari/>
    },
    {
      path: "/yangi-parol",
      element: <NewPassword/>
    },
    {
      path: "/login",
      element: userData ? <Navigate to="/"/> : <Login/>,
    },
    {
      path: "/register",
      element: userData ? <Navigate to="/"/> : <Register />,
    },
  ]);
  return <RouterProvider router={routes} />;
}

export default App;
