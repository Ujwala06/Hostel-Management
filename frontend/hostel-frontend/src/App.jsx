import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import WorkerDashboard from './pages/WorkerDashboard.jsx';
import RoomManagementPage from './pages/RoomManagementPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import {Toaster} from 'react-hot-toast';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/student"
        element={(
          <ProtectedRoute roles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/admin"
        element={(
          <ProtectedRoute roles={['ADMIN', 'WARDEN']}>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/admin/rooms"
        element={(
          <ProtectedRoute roles={['ADMIN', 'WARDEN']}>
            <RoomManagementPage />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/worker"
        element={(
          <ProtectedRoute roles={['WORKER']}>
            <WorkerDashboard />
          </ProtectedRoute>
        )}
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
     <Toaster position="top-right" />
     </>
  );
}

export default App;
