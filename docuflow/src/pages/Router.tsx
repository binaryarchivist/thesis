import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Layout from '@/components/layout';
import CreateDocument from './document/create';
import Archive from './document/archive';
import Sign from './document/sign';
import Review from './document/review';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentPageName={'Dashboard'}>
              <Dashboard />
            </Layout>
          }
        />
         <Route
          path="/create"
          element={
            <Layout currentPageName={'Create Document'}>
              <CreateDocument />
            </Layout>
          }
        />
          <Route
          path="/archived"
          element={
            <Layout currentPageName={'Archived Documents'}>
              <Archive />
            </Layout>
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
            <Layout currentPageName={'Pending Documents'}>
              <Review />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
