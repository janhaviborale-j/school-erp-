import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Students from './pages/students/Students';
import AddStudent from './pages/students/AddStudent';
import EditStudent from './pages/students/EditStudent';
import StudentDetails from './pages/students/StudentDetails';
import Parents from './pages/parents/Parents';
import Classes from './pages/classes/Classes';
import Attendance from './pages/attendance/Attendance';
import AttendanceHistory from './pages/attendance/AttendanceHistory';
import FeeCollection from './pages/fees/FeeCollection';
import PendingFees from './pages/fees/PendingFees';
import FeeStructure from './pages/fees/FeeStructure';
import Payments from './pages/payments/Payments';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Students Module */}
                <Route path="/students" element={<Students />} />
                <Route path="/students/add" element={<AddStudent />} />
                <Route path="/students/:id" element={<StudentDetails />} />
                <Route path="/students/edit/:id" element={<EditStudent />} />

                {/* Parents Module */}
                <Route path="/parents" element={<Parents />} />

                {/* Classes Module */}
                <Route path="/classes" element={<Classes />} />

                {/* Attendance Module */}
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/attendance/history" element={<AttendanceHistory />} />

                {/* Fees & Collections Module */}
                <Route path="/fees" element={<FeeCollection />} />
                <Route path="/fees/pending" element={<PendingFees />} />
                <Route path="/fees/structure" element={<FeeStructure />} />

                {/* Payments & Receipts Ledger */}
                <Route path="/payments" element={<Payments />} />

                {/* Reports & Analytics */}
                <Route path="/reports" element={<Reports />} />

                {/* Settings */}
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
