import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Loading from "./components/loading";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Signin from "./routes/signin";
import Signup from "./routes/signup";

import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import ProtectedRoute from './components/protected-route';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
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
    element: <Signin />
  },
  {
    path: "/signup",
    element: <Signup />
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset};

  * {
    box-sizing: border-box;
  }
  
  body {
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 
      "Segoe UI", Roboto, "Noto Sans KR", Arial, sans-serif;
    display: flex;
    justify-content: center;
  }
`;

function App() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async() => {
      // await auth.authStateReady();
      setTimeout(() => setLoading(false), 2000);
    };

    fetchData();
  }, []);

  return (
    <>
      <GlobalStyles />
      { isLoading ? <Loading /> : <RouterProvider router={router} /> }
    </>
  )
}

export default App
