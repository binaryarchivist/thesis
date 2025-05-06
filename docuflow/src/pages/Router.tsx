import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard';
import Layout from '@/components/layout';
import CreateDocument from './document/create';
import Archive from './document/archive';
import Sign from './document/sign';
import Review from './document/review';
import { useAuthContext } from '@/contexts/AuthContext';
import Login from './login';
import DocumentDetail from './document/detail';

function Protected({ children, currentPageName }){
    const authContext = useAuthContext();
  
    if (authContext?.accessToken) {
      return <Layout currentPageName={currentPageName}>{children}</Layout>;
    }
  
    return <Navigate to="/login" replace />;
  }

  
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protected currentPageName={'Dashboard'}>
              <Dashboard />
            </Protected>
          }
        />
         <Route
          path="/create"
          element={
            <Protected currentPageName={'Create Document'}>
              <CreateDocument />
            </Protected>
          }
        />
          <Route
          path="/archived"
          element={
            <Protected currentPageName={'Archived Documents'}>
              <Archive />
            </Protected>
          }
        />
          <Route
          path="/approved"
          element={
            <Layout currentPageName={'Approved Documents'}>
              <Sign />
            </Layout>
          }
        />
          <Route
          path="/pending"
          element={
            <Protected currentPageName={'Pending Documents'}>
              <Review />
            </Protected>
          }
        />
           <Route
          path="/documents/:id"
          element={
            <Protected currentPageName={'Document Detail'}>
              <DocumentDetail />
            </Protected>
          }
        />
            <Route
                 path="/login"
                 element={
                   <Login/>
                 }
          />
      </Routes>
    </BrowserRouter>
  );
}
