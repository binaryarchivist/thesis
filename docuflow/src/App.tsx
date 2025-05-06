import AppRoutes from './pages/Router';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  );
}
