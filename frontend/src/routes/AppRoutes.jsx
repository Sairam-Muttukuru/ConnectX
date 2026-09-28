import { useState, useEffect } from 'react';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import useAuth from '../hooks/useAuth';

export default function AppRoutes({ isDark, toggleTheme, renderLanding }) {
  const { isAuthenticated } = useAuth();
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.startsWith('#login')) return 'login';
    if (hash.startsWith('#signup') || hash.startsWith('#register')) return 'register';
    if (hash.startsWith('#verify-email')) return 'verify-email';
    if (hash.startsWith('#forgot-password')) return 'forgot-password';
    if (hash.startsWith('#reset-password')) return 'reset-password';
    if (hash.startsWith('#dashboard')) return 'dashboard';
    return 'landing';
  });

  const parseHashParams = () => {
    const hash = window.location.hash;
    const qIndex = hash.indexOf('?');
    if (qIndex !== -1) {
      const queryStr = hash.slice(qIndex + 1);
      const params = new URLSearchParams(queryStr);
      const obj = {};
      for (const [k, v] of params.entries()) {
        obj[k] = v;
      }
      return obj;
    }
    return {};
  };

  const [routeParams, setRouteParams] = useState(() => parseHashParams());

  useEffect(() => {
    const handleHashChange = () => {
      setRouteParams(parseHashParams());
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#login')) {
        setRoute('login');
      } else if (hash.startsWith('#signup') || hash.startsWith('#register')) {
        setRoute('register');
      } else if (hash.startsWith('#verify-email')) {
        setRoute('verify-email');
      } else if (hash.startsWith('#forgot-password')) {
        setRoute('forgot-password');
      } else if (hash.startsWith('#reset-password')) {
        setRoute('reset-password');
      } else if (hash.startsWith('#dashboard')) {
        setRoute('dashboard');
      } else {
        setRoute('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page, params = {}) => {
    setRouteParams(params);
    let hash = '';
    if (page === 'login') hash = '#login';
    else if (page === 'signup' || page === 'register') hash = '#signup';
    else if (page === 'verify-email') {
      const q = new URLSearchParams();
      if (params.email) q.set('email', params.email);
      if (params.otp) q.set('otp', params.otp);
      if (params.token) q.set('token', params.token);
      const str = q.toString();
      hash = str ? `#verify-email?${str}` : '#verify-email';
    } else if (page === 'forgot-password') hash = '#forgot-password';
    else if (page === 'reset-password') {
      const q = new URLSearchParams();
      if (params.email) q.set('email', params.email);
      if (params.otp) q.set('otp', params.otp);
      if (params.token) q.set('token', params.token);
      const str = q.toString();
      hash = str ? `#reset-password?${str}` : '#reset-password';
    } else if (page === 'dashboard') {
      hash = params?.tab ? `#dashboard/${params.tab.toLowerCase()}` : '#dashboard/home';
    }

    window.location.hash = hash;
    setRoute(page === 'signup' ? 'register' : page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const effectiveRoute = isAuthenticated && (route === 'login' || route === 'register') ? 'dashboard' : route;

  switch (effectiveRoute) {
    case 'login':
      return (
        <LoginPage
          onNavigate={navigateTo}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      );

    case 'register':
      return (
        <RegisterPage
          onNavigate={navigateTo}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      );

    case 'verify-email':
      return (
        <VerifyEmailPage
          initialOtp={routeParams.otp || ''}
          initialToken={routeParams.token || ''}
          initialEmail={routeParams.email || ''}
          onNavigate={navigateTo}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      );

    case 'forgot-password':
      return (
        <ForgotPasswordPage
          onNavigate={navigateTo}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      );

    case 'reset-password':
      return (
        <ResetPasswordPage
          initialToken={routeParams.token || ''}
          initialOtp={routeParams.otp || ''}
          initialEmail={routeParams.email || ''}
          onNavigate={navigateTo}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      );

    case 'dashboard':
      return (
        <ProtectedRoute fallbackNavigate={navigateTo} isDark={isDark}>
          <DashboardPage
            onNavigate={navigateTo}
            isDark={isDark}
            toggleTheme={toggleTheme}
          />
        </ProtectedRoute>
      );

    case 'landing':
    default:
      return renderLanding(navigateTo);
  }
}
