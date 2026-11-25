import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

import { DemoBanner } from './components/DemoBanner.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

// Pages
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AwarenessCentre } from './pages/awareness/AwarenessCentre.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { HouseholdManagement } from './pages/admin/HouseholdManagement.jsx';
import { UserManagement } from './pages/admin/UserManagement.jsx';
import { RecommendationRuleSettings } from './pages/admin/RecommendationRuleSettings.jsx';
import { HealthWorkerDashboard } from './pages/health-worker/HealthWorkerDashboard.jsx';
import { SurveyForm } from './pages/health-worker/SurveyForm.jsx';
import { PregnancyDashboard } from './pages/health-worker/PregnancyDashboard.jsx';
import { PregnancyRegistration } from './pages/health-worker/PregnancyRegistration.jsx';
import { SurveyDetails } from './pages/surveys/SurveyDetails.jsx';
import { VillagerDashboard } from './pages/villager/VillagerDashboard.jsx';
import { MyPregnancyRecord } from './pages/villager/MyPregnancyRecord.jsx';
import { ConsentPreferences } from './pages/villager/ConsentPreferences.jsx';
import { NotificationsPage } from './pages/notifications/NotificationsPage.jsx';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
              <DemoBanner />
              <Navbar />

              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/awareness" element={<AwarenessCentre />} />

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/rules" element={<RecommendationRuleSettings />} />
                  </Route>

                  {/* Health Worker & Admin Shared Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin', 'health_worker']} />}>
                    <Route path="/health-worker" element={<HealthWorkerDashboard />} />
                    <Route path="/households" element={<HouseholdManagement />} />
                    <Route path="/surveys" element={<HouseholdManagement />} />
                    <Route path="/surveys/conduct/:householdId" element={<SurveyForm />} />
                    <Route path="/surveys/view/:id" element={<SurveyDetails />} />
                    <Route path="/maternal" element={<PregnancyDashboard />} />
                    <Route path="/maternal/register" element={<PregnancyRegistration />} />
                  </Route>

                  {/* Villager Specific Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['villager', 'admin']} />}>
                    <Route path="/villager" element={<VillagerDashboard />} />
                    <Route path="/villager/maternal" element={<MyPregnancyRecord />} />
                    <Route path="/villager/consent" element={<ConsentPreferences />} />
                  </Route>

                  {/* General Protected Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin', 'health_worker', 'villager']} />}>
                    <Route path="/notifications" element={<NotificationsPage />} />
                  </Route>

                  {/* 404 Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </NotificationProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
