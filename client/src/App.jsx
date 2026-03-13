import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageTest from './pages/admin/ManageTest';
import ManageTests from './pages/admin/ManageTests';
import TestAnalytics from './pages/admin/TestAnalytics';
import ManageClasses from './pages/admin/ManageClasses';
import ManageStudents from './pages/admin/ManageStudents';
import AdminReports from './pages/admin/Reports';
import MistakeAnalytics from './pages/admin/MistakeAnalytics';
import ManageMockTests from './pages/admin/ManageMockTests';
import ManageMockTestSections from './pages/admin/ManageMockTestSections';

import TakeTest from './pages/student/TakeTest';
import ResultReview from './pages/student/ResultReview';
import StudentReports from './pages/student/StudentReports';
import MistakeBook from './pages/student/MistakeBook';
import StudentMockTests from './pages/student/StudentMockTests';
import MockTestDetails from './pages/student/MockTestDetails';
import TakeMockTest from './pages/student/TakeMockTest';
import MockTestResult from './pages/student/MockTestResult';
import StudentMockTestReports from './pages/student/StudentMockTestReports';
import GenerateTest from './pages/student/GenerateTest';

const AppContent = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (!user && !isAuthPage) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && isAuthPage) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!user || isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Routes */}
        {user.role === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/manage-tests" element={<ManageTests />} />
            <Route path="/admin/test/:id" element={<ManageTest />} />
            <Route path="/admin/test/:id/analytics" element={<TestAnalytics />} />
            <Route path="/admin/manage-mock-tests" element={<ManageMockTests />} />
            <Route path="/admin/mock-test/:id/sections" element={<ManageMockTestSections />} />
            <Route path="/admin/classes" element={<ManageClasses />} />
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/mistake-analytics" element={<MistakeAnalytics />} />
          </>
        )}

        {/* Student Routes */}
        {user.role === 'student' && (
          <>
            <Route path="/student/dashboard" element={<Dashboard />} />
            <Route path="/student/test/:id" element={<TakeTest />} />
            <Route path="/student/result/:id" element={<ResultReview />} />
            <Route path="/student/mock-tests" element={<StudentMockTests />} />
            <Route path="/student/mock-test/:id" element={<MockTestDetails />} />
            <Route path="/student/mock-test/:id/take" element={<TakeMockTest />} />
            <Route path="/student/mock-test-result/:id" element={<MockTestResult />} />
            <Route path="/student/mock-test-reports" element={<StudentMockTestReports />} />
            <Route path="/student/generate-test" element={<GenerateTest />} />
            <Route path="/student/reports" element={<StudentReports />} />
            <Route path="/student/mistake-book" element={<MistakeBook />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

