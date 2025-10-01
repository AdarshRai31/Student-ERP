import React from 'react';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
