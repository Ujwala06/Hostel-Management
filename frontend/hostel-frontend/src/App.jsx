import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import WorkerDashboard from './pages/WorkerDashboard.jsx';
import RoomManagementPage from './pages/RoomManagementPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

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

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
