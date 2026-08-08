import React from 'react';
import { History, ShieldCheck } from 'lucide-react';
import { StorageService } from '../../services/storageService';

export const AdminActivityLogs: React.FC = () => {
  const logs = StorageService.getLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Activity Logs & Audit Trail</h1>
        <p className="text-xs text-text-muted">Complete security audit trail of administrative modifications.</p>
      </div>

      <div className="card-dark rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/5 text-text-muted uppercase font-mono">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
                <th className="p-4">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 text-text-muted font-mono">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-brand-cyan">{log.action}</td>
                  <td className="p-4 text-text-secondary">{log.details}</td>
                  <td className="p-4 text-white font-mono">{log.admin_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
