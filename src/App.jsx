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
import OptionQuiz from "./pages/OptionQuiz";
import AttestatsiyaTestlari from "./pages/AttestatsiyaTestlari";
import NewPassword from "./pages/NewPassword";
import ProtectedRoute from "./pages/ProtectedRoute";
import MilliyTestQuiz from "./pages/MilliyTestQuiz";
import MilliySertifikatTasdiqlash from "./pages/MilliySertifikatTasdiqlash";

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error if needed
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-screen px-5">
          <div className="flex flex-col gap-5 shadow-2xl rounded-2xl p-5 w-full md:w-96 md:p-10">
            <h1 className="text-center text-2xl text-red-500">Xatolik yuz berdi</h1>
            <p className="text-white text-center">Iltimos, sahifani qayta yuklang</p>
            <button 
              onClick={() => window.location.href = '/tasdiqlash-kodi'}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Bosh sahifa
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const {userData} = useContext(GlobalContext)

  const routes = createBrowserRouter([
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
    {
      path: "/tasdiqlash-kodi",
      element: <ErrorBoundary><MilliySertifikatTasdiqlash/></ErrorBoundary>,
      errorElement: <ErrorBoundary><div>Error loading page</div></ErrorBoundary>
    },
    {
      path:"/milliy-quiz",
      element: <ErrorBoundary><MilliyTestQuiz/></ErrorBoundary>,
      errorElement: <ErrorBoundary><div>Error loading quiz</div></ErrorBoundary>
    },
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
