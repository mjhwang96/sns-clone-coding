import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Loading from "./components/loading";
import Home from "./pages/main/Home";
import Profile from "./pages/main/Profile";
import Signin from "./pages/auth/SignIn";
import Signup from "./pages/auth/SignUp";

import reset from "styled-reset";
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthLayout from './components/layout/AuthLayout';
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
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
  }

  html, body, #root {
    height: 100%;
    margin: 0;
  }
`;

const Footer = styled.a`
  position: fixed;       /* 화면에 고정 */
  bottom: 10px;          /* 아래에서 10px 위 */
  right: 0;              /* 오른쪽 끝 */
  margin-right: 10px;    /* 화면 안쪽으로 조금 띄우기 */
  font-size: 12px;
  color: #555;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 1000;
`;

function App() {
  const [ isDark, setIsDark ] = useState(false);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
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
      <RouterProvider router={router} />

      {/* Icon 사용 저작권 표시 */}
      <Footer
        href="https://www.flaticon.com/free-icons/cute"
        title="cute icons"
        target="_blank"
        rel="noopener noreferrer"
        className="credit-link"
      >
        Cute icons created by Smashicons - Flaticon
      </Footer>
    </ThemeProvider>
  )
}

export default App
