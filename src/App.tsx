import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Loading from "./components/loading";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signin from "./pages/auth/SignIn";
import Signup from "./pages/auth/SignUp";

import reset from "styled-reset";
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './components/layout/AuthLayout';
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./lib/theme";
import GowunDodum from './assets/fonts/GowunDodum-Regular.ttf';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ]
  },
  {
    path: "/signin",
    element: (
      <AuthLayout>
        <Signin />
      </AuthLayout>
    )
  },
  {
    path: "/signup",
    element: (
      <AuthLayout>
        <Signup />
      </AuthLayout>
    )
  }
])

// 전체 Style
const GlobalStyles = createGlobalStyle`
  ${reset};

  @font-face {
    font-family: 'GowunDodum';
    src: url(${GowunDodum}) format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'GowunDodum', sans-serif;
    color: ${({ theme }) => theme.textColor};
    background-color: ${({ theme }) => theme.backgroundColor};
    display: flex;
  }
`;

function App() {
  const [ isDark, setIsDark ] = useState(false);
  const [ isLoading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchData = async() => {
      // await auth.authStateReady();
      setTimeout(() => setLoading(false), 2000);
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <>
        <GlobalStyles />

        <button
          onClick={() => setIsDark((prev) => !prev)}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
          }}
        >
          { isDark ? "☀️ Light" : "🌙 Dark" }
        </button>
        { isLoading ? <Loading /> : <RouterProvider router={router} /> }
      </>
    </ThemeProvider>
  )
}

export default App
