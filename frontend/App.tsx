import { Navigate, Route, Routes } from 'react-router-dom'
import './brandTheme.css'
import { Toaster } from './lib/shadcn/sonner'
import DevNavBar from './components/DevNavBar'
import PingForgeDbButton from './components/PingForgeDbButton'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import VerifyPage from './pages/VerifyPage'
// Diagnostic page is currently disabled — file kept for future use.
// import CredentialDiagnosticPage from './pages/CredentialDiagnosticPage'
import DashboardPage from './pages/DashboardPage'
import CharterGenerationPage from './pages/CharterGenerationPage'
import CharterGenerationWizardPage from './pages/CharterGenerationWizardPage'
import GovernanceReviewPage from './pages/GovernanceReviewPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        {/* Diagnostic route is disabled. The page component is preserved at
            ./pages/CredentialDiagnosticPage but is no longer reachable; any
            visit to /diagnostics/credential-check falls through to the
            catch-all redirect below. Re-enable by restoring the import above
            and the <Route> block here. */}
        {/*
        <Route
          path="/diagnostics/credential-check"
          element={<CredentialDiagnosticPage />}
        />
        */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/charter" element={<CharterGenerationPage />} />
          <Route path="/wizard" element={<CharterGenerationWizardPage />} />
          <Route path="/governance" element={<GovernanceReviewPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
      <DevNavBar />
      <PingForgeDbButton />
    </>
  )
}
