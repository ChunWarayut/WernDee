import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import thTH from 'antd/locale/th_TH';
import store from './store/store';
import AuthGuard from './components/auth/AuthGuard';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NursesPage from './pages/nurses/NursesPage';
import SchedulePage from './pages/schedule/SchedulePage';
import RequestsPage from './pages/requests/RequestsPage';
import Layout from './components/layout/Layout';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={thTH}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <AuthGuard>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/nurses" element={<NursesPage />} />
                        <Route path="/schedule" element={<SchedulePage />} />
                        <Route path="/requests" element={<RequestsPage />} />
                      </Routes>
                    </Layout>
                  </AuthGuard>
                }
              />
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
