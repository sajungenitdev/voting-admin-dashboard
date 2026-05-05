import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Polls from './pages/Polls'
import Layout from './components/layout/Layout'

const PrivateRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth)
  if (!token) return <Navigate to="/login" />
  if (user?.role !== 'admin') return <Navigate to="/unauthorized" />
  return children
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Layout>
                <Users />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/polls"
          element={
            <PrivateRoute>
              <Layout>
                <Polls />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App