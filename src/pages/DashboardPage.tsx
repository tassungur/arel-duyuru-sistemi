import React from 'react';
import type { AnnouncementSummaryDto } from '../types/announcement';

interface DashboardPageProps {
  tenantCode: string;
  submissions: AnnouncementSummaryDto[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ tenantCode, submissions }) => {
  return (
    <main style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>İstanbul Arel Üniversitesi — Kurum İçi Duyuru Yönetim Sistemi</h1>
      <p>
        Aktif Birim Kodu: <strong>{tenantCode}</strong>
      </p>
      <section style={{ marginTop: '16px' }}>
        <h2>Duyuru Kuyruğu ({submissions.length})</h2>
        <ul>
          {submissions.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong> (<code>{item.templateCode}</code>) — {item.status}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};
