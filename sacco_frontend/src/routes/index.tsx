import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
// import ForgotPassword from '@/pages/auth/ForgotPassword';

// Dashboard Pages
import Dashboard from '@/pages/dashboard/Dashboard';

// Member Pages
import MembersList from '@/pages/members/MembersList';
// import MemberProfile from '@/pages/members/MemberProfile';
// import AddMember from '@/pages/members/AddMember';

// // Loan Pages
import LoansList from '@/pages/loans/LoansList';
import LoanDetails from '@/pages/loans/LoanDetails';
import ApplyLoan from '@/pages/loans/ApplyLoan';

// // Savings Pages
// import SavingsAccounts from '@/pages/savings/SavingsAccounts';
// import AccountDetails from '@/pages/savings/AccountDetails';
// import MakeTransaction from '@/pages/savings/MakeTransaction';

// // Transaction Pages
// import TransactionHistory from '@/pages/transactions/TransactionHistory';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute restricted>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute restricted>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </PublicRoute>
        }
      />
      {/* <Route
        path="/forgot-password"
        element={
          <PublicRoute restricted>
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          </PublicRoute>
        }
      /> */}
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      
      {/* Member Routes */}
      <Route
        path="/members"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <MembersList />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/members/add"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <AddMember />
            </DashboardLayout>
          </PrivateRoute>
        }
      /> */}
      {/* <Route
        path="/members/:id"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <MemberProfile />
            </DashboardLayout>
          </PrivateRoute>
        }
      /> */}
      
      {/* Loan Routes */}
      <Route
        path="/loans"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <LoansList />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/loans/apply"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <ApplyLoan />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/loans/:id"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <LoanDetails />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      
      {/* Savings Routes */}
      {/* <Route
        path="/savings"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <SavingsAccounts />
            </DashboardLayout>
          </PrivateRoute>
        }
      /> */}
      {/* <Route
        path="/savings/:id"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <AccountDetails />
            </DashboardLayout>
          </PrivateRoute>
        }
      /> */}
      {/* <Route
        path="/savings/:id/transaction"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <MakeTransaction />
            </DashboardLayout>
          </PrivateRoute>
        }
      /> */}
      
      {/* Transaction Routes */}
      {/* <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <TransactionHistory />
            </DashboardLayout>
          </PrivateRoute>
        }
      /> */}
      
      {/* 404 Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;