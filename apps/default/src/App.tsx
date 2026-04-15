import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { GenesisAuth } from '@/lib/genesis-auth';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Council } from '@/pages/Council';
import { Journal } from '@/pages/Journal';
import { Library } from '@/pages/Library';

const App: React.FC = function () {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <GenesisAuth>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/council" element={<Council />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/library" element={<Library />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </GenesisAuth>
    </ThemeProvider>
  );
};

export default App;
