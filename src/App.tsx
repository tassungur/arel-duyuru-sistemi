import React from 'react';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  return <DashboardPage tenantCode="ik" submissions={[]} />;
};

export default App;
