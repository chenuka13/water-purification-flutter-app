import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TemperatureDetails from './components/TemperatureDetails';
import ConductivityDetails from './components/ConductivityDetails';
import TurbidityDetails from './components/TurbidityDetails';
import OverallQualityDetails from './components/OverallQualityDetails';
import Login from './components/Login';
import Register from './components/Register';
import { WaterQualityProvider } from './contexts/WaterQualityContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationToast from './components/NotificationToast';

import Forum from './components/Forum';
import Chatbot from './components/Chatbot';
import Reports from './components/Reports';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {this.state.error.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WaterQualityProvider>
          <NotificationProvider>
            <ThemeProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                  <NotificationToast />
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/turbidity" element={<TurbidityDetails />} />
                    <Route path="/temperature" element={<TemperatureDetails />} />
                    <Route path="/conductivity" element={<ConductivityDetails />} />
                    <Route path="/overall-quality" element={<OverallQualityDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                  <Chatbot />
                </div>
              </Router>
            </ThemeProvider>
          </NotificationProvider>
        </WaterQualityProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
