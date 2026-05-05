import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Polls from "./pages/Polls";
import B2B from "./pages/B2B";
import Analytics from "./pages/Analytics";
import Revenue from "./pages/Revenue";
import Subscriptions from "./pages/Subscriptions";
import ActivityLogs from "./pages/ActivityLogs";
import Settings from "./pages/Settings";
import B2BRequests from "./pages/b2b/B2BRequests";
import B2BSubscriptions from "./pages/b2b/B2BSubscriptions";
import B2BPayments from "./pages/b2b/B2BPayments";
import { authService } from "./services/auth";
import B2BUsers from "./pages/b2b/B2BUsers";
import B2BCategories from "./pages/b2b/B2BCategories";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/unauthorized" />;

  return children;
};

function App() {
  return (
    <Router>
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
        <Route
          path="/b2b"
          element={
            <PrivateRoute>
              <Layout>
                <B2B />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/b2b/requests"
          element={
            <PrivateRoute>
              <Layout>
                <B2BRequests />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/b2b/subscriptions"
          element={
            <PrivateRoute>
              <Layout>
                <B2BSubscriptions />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/b2b/users"
          element={
            <PrivateRoute>
              <Layout>
                <B2BUsers />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/b2b/categories"
          element={
            <PrivateRoute>
              <Layout>
                <B2BCategories />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/b2b/payments"
          element={
            <PrivateRoute>
              <Layout>
                <B2BPayments />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Layout>
                <Analytics />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/revenue"
          element={
            <PrivateRoute>
              <Layout>
                <Revenue />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <PrivateRoute>
              <Layout>
                <Subscriptions />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/activity-logs"
          element={
            <PrivateRoute>
              <Layout>
                <ActivityLogs />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <Settings />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
