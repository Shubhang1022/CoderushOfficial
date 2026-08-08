import React from 'react';
import { Eye, Users, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const zeroData = [
  { name: 'Mon', views: 0, visitors: 0 },
  { name: 'Tue', views: 0, visitors: 0 },
  { name: 'Wed', views: 0, visitors: 0 },
  { name: 'Thu', views: 0, visitors: 0 },
  { name: 'Fri', views: 0, visitors: 0 },
  { name: 'Sat', views: 0, visitors: 0 },
  { name: 'Sun', views: 0, visitors: 0 },
];

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Platform Analytics</h1>
        <p className="text-xs text-text-muted">Traffic trends and visitor engagement metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-dark p-5 rounded-2xl border border-white/10 space-y-2">
          <Eye className="w-5 h-5 text-brand-cyan" />
          <div className="text-2xl font-heading font-bold text-white">0</div>
          <div className="text-xs text-text-muted font-medium">Page Views (This Week)</div>
        </div>

        <div className="card-dark p-5 rounded-2xl border border-white/10 space-y-2">
          <Users className="w-5 h-5 text-brand-blue" />
          <div className="text-2xl font-heading font-bold text-white">0</div>
          <div className="text-xs text-text-muted font-medium">Unique Visitors</div>
        </div>

        <div className="card-dark p-5 rounded-2xl border border-white/10 space-y-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <div className="text-2xl font-heading font-bold text-white">0%</div>
          <div className="text-xs text-text-muted font-medium">Growth Rate</div>
        </div>
      </div>

      <div className="card-dark p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="font-heading font-bold text-white text-base">Weekly Traffic Overview</h3>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={zeroData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F6BFF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4F6BFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00C2FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#7C8596" fontSize={11} />
              <YAxis stroke="#7C8596" fontSize={11} domain={[0, 10]} />
              <Tooltip contentStyle={{ backgroundColor: '#0F1623', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="views" stroke="#4F6BFF" fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="visitors" stroke="#00C2FF" fillOpacity={1} fill="url(#colorVisitors)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
