import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar';
import { Footer } from '../components/ui/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#04060A] text-white flex flex-col selection:bg-brand-blue selection:text-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
