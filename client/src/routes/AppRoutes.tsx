import { JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import LoginPage from './login';
import DashboardLayout from 'components/dashboard';
import DocumentsListPage from './documents/list';
import DocumentsDetailsPage from './documents/details';
import DocumentCreatePage from './documents/create';

function Protected({ children }: { children: JSX.Element }) {
  const authContext = useAuthContext();

  if (authContext?.accessToken) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <DocumentsListPage />
            </Protected>
          }
        />
        <Route
          path="/documents/new"
          element={
            <Protected>
              <DocumentCreatePage />
            </Protected>
          }
        />
        <Route
          path="/documents/:id"
          element={
            <Protected>
              <DocumentsDetailsPage />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
