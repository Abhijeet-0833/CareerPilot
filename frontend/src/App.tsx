import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AIChatPanel } from './components/ai/AIChatPanel';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { Dashboard } from './pages/Dashboard';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { ResumeVersionsPage } from './pages/ResumeVersionsPage';
import { JDAnalyzer } from './pages/JDAnalyzer';
import { SkillGapRoadmap } from './pages/SkillGapRoadmap';
import { JobSearch } from './pages/JobSearch';
import { ApplicationTracker } from './pages/ApplicationTracker';
import { MockInterview } from './pages/MockInterview';
import { TechnicalAssessment } from './pages/TechnicalAssessment';
import { RecruiterPortal } from './pages/RecruiterPortal';
import { CollegePortal } from './pages/CollegePortal';
import { AdminPortal } from './pages/AdminPortal';
import { PricingPage } from './pages/PricingPage';

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/verify-email', '/reset-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex overflow-hidden">
        {!isPublicPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            {/* Protected Job Seeker & General Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
            <Route path="/resume-versions" element={<ProtectedRoute><ResumeVersionsPage /></ProtectedRoute>} />
            <Route path="/jd-analyzer" element={<ProtectedRoute><JDAnalyzer /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><SkillGapRoadmap /></ProtectedRoute>} />
            <Route path="/job-search" element={<ProtectedRoute><JobSearch /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
            <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
            <Route path="/assessments" element={<ProtectedRoute><TechnicalAssessment /></ProtectedRoute>} />

            {/* Protected Role Specific Routes */}
            <Route path="/recruiter" element={<ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}><RecruiterPortal /></ProtectedRoute>} />
            <Route path="/college" element={<ProtectedRoute allowedRoles={['COLLEGE_ADMIN', 'ADMIN']}><CollegePortal /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPortal /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>

      {!isPublicPage && <AIChatPanel />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
