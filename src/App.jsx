import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './stores/authStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import AdminUsersPage from "./pages/AdminUsersPage";
import ProfilePage from './pages/ProfilePage';
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import BandejaMensajes from './pages/BandejaMensajes';
import ChatPrivado from './pages/ChatPrivado';
import PhotoDetailPage from './pages/PhotoDetailPage';
import AdminReportesPage from './pages/AdminReportesPage';

import '@fortawesome/fontawesome-free/css/all.min.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Admin */}
            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute>
                  <AdminUsersPage />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/reportes"
              element={
                <ProtectedAdminRoute>
                  <AdminReportesPage />
                </ProtectedAdminRoute>
              }
            />

            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={<BandejaMensajes />} />

            <Route path="/mensajes/chat/:idDestino"
              element={<ChatPrivado />} />

            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Photo Detail Route */}
            <Route path="/fotografias/:id" element={<PhotoDetailPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;