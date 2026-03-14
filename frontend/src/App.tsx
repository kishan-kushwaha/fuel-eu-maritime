import { useState } from 'react';
import { DashboardLayout } from './adapters/ui/components/layout/DashboardLayout';
import { Tabs } from './adapters/ui/components/layout/Tabs';
import { BankingPage } from './adapters/ui/pages/BankingPage';
import { ComparePage } from './adapters/ui/pages/ComparePage';
import { PoolingPage } from './adapters/ui/pages/PoolingPage';
import { RoutesPage } from './adapters/ui/pages/RoutesPage';

const TABS = ['Routes', 'Compare', 'Banking', 'Pooling'];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('Routes');

  return (
    <DashboardLayout>
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'Routes' ? <RoutesPage /> : null}
      {activeTab === 'Compare' ? <ComparePage /> : null}
      {activeTab === 'Banking' ? <BankingPage /> : null}
      {activeTab === 'Pooling' ? <PoolingPage /> : null}
    </DashboardLayout>
  );
}
