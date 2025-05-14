import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/customers/Customers';
import Products from './pages/products/Products';
import Sales from './pages/sales/Sales';
import Returns from './pages/returns/Returns';
import Payments from './pages/payments/Payments';
import UserManagement from './pages/users/UserManagement';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { currentUser, loading } = useAuth();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentUser) {
      // إعادة ضبط المؤقت عند أي تفاعل
      const resetTimeout = () => {
        if (timeoutId) clearTimeout(timeoutId);
        const id = setTimeout(() => {
          // تسجيل الخروج التلقائي بعد 10 دقائق من عدم النشاط
          // سيتم تنفيذ هذا في سياق AuthContext
        }, 10 * 60 * 1000); // 10 دقائق
        setTimeoutId(id);
      };

      // إضافة مستمعات الأحداث لإعادة تعيين المؤقت
      window.addEventListener('mousemove', resetTimeout);
      window.addEventListener('keypress', resetTimeout);
      window.addEventListener('click', resetTimeout);
      window.addEventListener('scroll', resetTimeout);

      // تعيين المؤقت الأولي
      resetTimeout();

      // تنظيف المؤقت والمستمعات عند فك التثبيت
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        window.removeEventListener('mousemove', resetTimeout);
        window.removeEventListener('keypress', resetTimeout);
        window.removeEventListener('click', resetTimeout);
        window.removeEventListener('scroll', resetTimeout);
      };
    }
  }, [currentUser, timeoutId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return currentUser ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={createTheme()}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Customers />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Products />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Sales />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/returns"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Returns />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Payments />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <UserManagement />
                  </Layout>
                }
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
